
SELECT users.name, rewards.description, rewards.amount_required
FROM rewards
INNER JOIN users ON rewards.user_id = users.id
WHERE users.id = 2;

SELECT users.name, COUNT(projects.id) AS project_count
FROM users
INNER JOIN projects ON users.id = projects.user_id
WHERE users.id = 2
GROUP BY users.name;

SELECT users.name, user_log.action, user_log.action_date
FROM users
INNER JOIN user_log ON users.id = user_log.user_id
WHERE users.id = 1
ORDER BY user_log.action_date DESC;

SELECT * FROM users
WHERE RIGHT(name, 1) = 'n';

SELECT * FROM users
WHERE LEFT(name, 1) = 'I';

SELECT * FROM users
WHERE SUBSTRING(name FROM 2 FOR 2) = 'va';

SELECT * FROM users
WHERE name Like '%n%';

SELECT *
FROM table_name
WHERE column_name LIKE 'a%e';

SELECT *
FROM table_name
WHERE column_name LIKE '[a-c]%';

SELECT DISTINCT created_at FROM users;

select goal_amount, title from projects
where goal_amount Between 4000.0 and 10000000.0 

select goal_amount, title from projects
Order by goal_amount DESC

SELECT * FROM users
WHERE email Like '_r'

-- 4 laba
--несколько условий 
SELECT p.title, p.description, u.name AS user_name
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'approved' AND p.goal_amount > 2000 AND u.created_at > 
'2023-01-01';

--вложенные конструкции 
SELECT p.title, u.name AS user_name
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE p.id IN (
    SELECT project_id
    FROM payments
    WHERE amount > 60
);

--joins 
--inner 
SELECT p.title, c.name AS category, u.name AS user_name
FROM projects p
INNER JOIN categories c ON p.category_id = c.id
INNER JOIN users u ON p.user_id = u.id;

--left outer 
SELECT u.name AS user_name, COUNT(p.id) AS projects_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id;

--full outer
SELECT u.name AS user_name, p.title
FROM users u
FULL OUTER JOIN projects p ON u.id = p.user_id;

--cross
SELECT u.name AS user_name, c.name AS category
FROM users u
CROSS JOIN categories c;

--self
SELECT p1.title AS project1, p2.title AS project2
FROM projects p1
JOIN projects p2 ON p1.category_id = p2.category_id
WHERE p1.id != p2.id;


--group requests

--group by
SELECT category_id, COUNT(*) AS project_count, AVG(goal_amount) AS avg_goal_amount
FROM projects
GROUP BY category_id;

--partion
SELECT user_id, SUM(amount) OVER (PARTITION BY user_id) AS total_spent
FROM payments;

--having
SELECT category_id, COUNT(*) AS project_count
FROM projects
GROUP BY category_id
HAVING COUNT(*) > 1;

--union
SELECT title FROM projects WHERE status = 'approved'
UNION
SELECT title FROM projects WHERE status = 'pending';

--difficult operations 
--EXISTS
SELECT 1
FROM projects p
WHERE EXISTS (
    SELECT 1
    FROM payments
    WHERE project_id = p.id AND amount > 50
);

--insert into select
INSERT INTO projects (user_id, title, description, goal_amount, status, category_id)
SELECT 1, 'New Project', 'Description for new project', 15000, 'Active', 2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'New Project');

--case
SELECT title,
       CASE
           WHEN goal_amount > 9000 THEN 'Large'
           WHEN goal_amount BETWEEN 5000 AND 9000 THEN 'Medium'
           ELSE 'Small'
       END AS project_size
FROM projects;

--explain
EXPLAIN SELECT p.title, u.name AS user_name
FROM projects p
JOIN users u ON p.user_id = u.id;


select u.id as user_id, p.id as project_id, p.title as project_title
from users u
join payments pay on u.id=pay.user_id
join projects p1 on pay.project_id=p1.id
join projects p on p.user_id = u.id
join rewards r on p1.user_id = r.user_id
where p1.category_id =1 and p.category_id =2
group by u.id ,p.id, p.title
having count(distinct p1.id) between 2 and 5;

--лаб 5
--триггеры 
--Триггер для пересчета суммы донатов на проект при каждом новом платеже:
CREATE OR REPLACE FUNCTION update_project_donation_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET goal_amount = goal_amount + NEW.amount
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_donation_total
AFTER INSERT ON payments
FOR EACH ROW EXECUTE FUNCTION update_project_donation_total();

-- автоматически создает уведомление для пользователя, когда ему добавляется новая награда
CREATE OR REPLACE FUNCTION notify_new_reward()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, is_read, created_at)
    VALUES (NEW.user_id, FALSE, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reward_notification
AFTER INSERT ON rewards
FOR EACH ROW EXECUTE FUNCTION notify_new_reward();

--триггер который создает уведомления когда меняется статус проекта в который вложился пользователь
CREATE OR REPLACE FUNCTION notify_project_status_change()
RETURNS TRIGGER AS $$
DECLARE
    invested_user RECORD;
BEGIN
    FOR invested_user IN
        SELECT DISTINCT user_id
        FROM payments
        WHERE project_id = NEW.id
    LOOP
        INSERT INTO notifications (user_id, is_read, created_at,content)
        VALUES (invested_user.user_id, FALSE, NOW(),'Project change status');
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_status_notification
AFTER UPDATE OF status ON projects
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION notify_project_status_change();

--Контроль целевого финансирования проекта
CREATE OR REPLACE FUNCTION check_project_funding_goal()
RETURNS TRIGGER AS $$
DECLARE
    donated_sum DECIMAL;  
BEGIN
    SELECT p.total_donated INTO donated_sum
    FROM projects p
    WHERE p.id = NEW.project_id;

    IF donated_sum >= (SELECT p.goal_amount FROM projects p WHERE p.id = NEW.project_id) THEN
        UPDATE projects
        SET status = 'финансирование завершено'
        WHERE id = NEW.project_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_project_funding_goal
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION check_project_funding_goal();

--процедуры 
--Процедура для получения общего количества пользователей и проектов в системе
CREATE OR REPLACE PROCEDURE mark_all_notifications_as_read_proc(user_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = proc_user_id;
END;
$$;
CALL mark_all_notifications_as_read_proc(1); 
SELECT * FROM notifications WHERE user_id = 1;

--обновление роли
CREATE OR REPLACE PROCEDURE update_user_role(input_user_id INT, new_role_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users
    SET role_id = new_role_id
    WHERE id = input_user_id;

    RAISE NOTICE 'User ID % role updated to %', input_user_id, new_role_id;
END;
$$;

CALL update_user_role(1, 2); 
SELECT id, role_id FROM users WHERE id = 1;

--Процедура для добавления новой награды с уведомлением пользователя
CREATE OR REPLACE PROCEDURE add_reward_with_notification(input_user_id INT, input_project_id INT, input_description VARCHAR, input_amount_required DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO rewards (project_id, user_id, description, amount_required)
    VALUES (input_project_id, input_user_id, input_description, input_amount_required);

    INSERT INTO notifications (user_id, is_read, created_at,content)
    VALUES (input_user_id, FALSE, NOW()," New reward");

    RAISE NOTICE 'Reward added for user % on project % and notification created.', input_user_id, input_project_id;
END;
$$;

CALL add_reward_with_notification(1, 2, 'Early Access', 50);
SELECT * FROM rewards WHERE user_id = 1 AND project_id = 2;
SELECT * FROM notifications WHERE user_id = 1 ORDER BY created_at DESC;


--запись действий пользователя
CREATE OR REPLACE PROCEDURE log_user_action(input_user_id INT, input_action VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO user_log (user_id, action, action_date)
    VALUES (input_user_id, input_action, NOW());

    RAISE NOTICE 'Action logged for user %: %', input_user_id, input_action;
END;
$$;

CALL log_user_action(1, 'Commented on a project');
SELECT * FROM user_log WHERE user_id = 1 ORDER BY action_date DESC;

--создание проекта 
CREATE OR REPLACE PROCEDURE create_project(
    input_user_id INT,
    input_title VARCHAR,
    input_description TEXT,
    input_goal_amount DECIMAL,
    input_category_id INT,
    input_status VARCHAR DEFAULT 'initialized'
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO projects (user_id, title, description, goal_amount, category_id, status, created_at)
    VALUES (input_user_id, input_title, input_description, input_goal_amount, input_category_id, input_status, NOW());

    RAISE NOTICE 'Project "%", created by User ID % with goal amount % and status "%".', input_title, input_user_id, input_goal_amount, input_status; 
END;
$$;

CALL create_project(1, 'New Community Project', 'A project to help the community', 10000, 2);
SELECT * FROM projects WHERE title = 'New Community Project';

--Процедура для добавления комментария к проекту
CREATE OR REPLACE PROCEDURE add_comment(
    input_user_id INT,
    input_project_id INT,
    input_content TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO comments (user_id, project_id, content, created_at)
    VALUES (input_user_id, input_project_id, input_content, NOW());

    RAISE NOTICE 'Comment added by User ID % on Project ID %: "%"', input_user_id, input_project_id, input_content;
END;
$$;
CALL add_comment(1, 2, 'This is a fantastic project!');
SELECT * FROM comments WHERE project_id = 2 AND user_id = 1;

--Процедура для оплаты в проект
CREATE OR REPLACE PROCEDURE make_payment(
    input_user_id INT,
    input_project_id INT,
    input_amount DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO payments (user_id, project_id, amount, payment_date)
    VALUES (input_user_id, input_project_id, input_amount, NOW());

    RAISE NOTICE 'Payment of % added for Project ID % by User ID %.', input_amount, input_project_id, input_user_id;
END;
$$;

CALL make_payment(1, 2, 500); 
SELECT * FROM payments WHERE project_id = 2 AND user_id = 1;

--Процедура для получения всех проектов в определенной категории
CREATE OR REPLACE PROCEDURE get_projects_by_category(input_category_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id, title, description, goal_amount, status, created_at
        FROM projects
        WHERE category_id = input_category_id
    LOOP
        RAISE NOTICE 'Project ID: %, Title: %, Goal: %, Status: %, Created at: %', 
                     rec.id, rec.title, rec.goal_amount, rec.status, rec.created_at;
    END LOOP;
END;
$$;

CALL get_projects_by_category(2);

--Процедура для получения списка всех комментариев к проекту
CREATE OR REPLACE PROCEDURE get_project_comments(input_project_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT c.id AS comment_id, u.name AS user_name, c.content, c.created_at
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.project_id = input_project_id
    LOOP
        RAISE NOTICE 'Comment ID: %, User: %, Content: %, Created at: %', 
                     rec.comment_id, rec.user_name, rec.content, rec.created_at;
    END LOOP;
END;
$$;

CALL get_project_comments(2); 

--все активные проекты пользователя
CREATE OR REPLACE PROCEDURE get_active_projects_except_ready(input_user_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id, title, description, goal_amount, created_at
        FROM projects
        WHERE user_id = input_user_id AND status != 'Completed' 
    LOOP
        RAISE NOTICE 'Project ID: %, Title: %, Goal: %, Created at: %', 
                     rec.id, rec.title, rec.goal_amount, rec.created_at;
    END LOOP;
END;
$$;

CALL get_active_projects_except_ready(1);  

--изменение статуса
CREATE OR REPLACE PROCEDURE update_project_status(
    input_project_id INT,
    new_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_status VARCHAR;
BEGIN
    SELECT status INTO current_status
    FROM projects
    WHERE id = input_project_id;
    IF current_status = new_status THEN
        RAISE NOTICE 'Project ID % already has the status "%".', input_project_id, new_status;
    ELSE
        UPDATE projects
        SET status = new_status
        WHERE id = input_project_id;

        RAISE NOTICE 'Project ID % status updated to "%".', input_project_id, new_status;
    END IF;
END;
$$;

CALL update_project_status(1, 'completed');
SELECT id, status FROM projects WHERE id = 1;

--Процедура для получения всех пользователей, вложившихся в конкретный проект
CREATE OR REPLACE PROCEDURE get_project_investors(input_project_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    investor RECORD;
BEGIN
    FOR investor IN
        SELECT u.id AS user_id, u.name AS user_name, SUM(p.amount) AS total_investment
        FROM payments p
        JOIN users u ON p.user_id = u.id
        WHERE p.project_id = input_project_id
        GROUP BY u.id, u.name
    LOOP
        RAISE NOTICE 'User ID: %, Name: %, Total Investment: %', 
                     investor.user_id, investor.user_name, investor.total_investment;
    END LOOP;
END;
$$;

CALL get_project_investors(2); 

--Процедура для создания уведомлений всем инвесторам при достижении цели проекта
CREATE OR REPLACE PROCEDURE notify_investors_goal_reached(input_project_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    investor RECORD;
BEGIN
    FOR investor IN
        SELECT DISTINCT user_id
        FROM payments
        WHERE project_id = input_project_id
    LOOP
        INSERT INTO notifications (user_id, is_read, created_at,content)
        VALUES (investor.user_id, FALSE, NOW(),'project financing has been completed');

        RAISE NOTICE 'Notification created for User ID % about Project ID % reaching its goal.', investor.user_id, input_project_id;
    END LOOP;
END;
$$;

CALL notify_investors_goal_reached(2);  

--процедура списка платежей к проекту 
CREATE OR REPLACE PROCEDURE get_project_payments(input_project_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    payment_record RECORD;
BEGIN
    FOR payment_record IN
        SELECT 
            pm.id AS payment_id,
            u.name AS user_name,
            pm.amount AS payment_amount,
            pm.payment_date
        FROM payments pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = input_project_id
    LOOP
        RAISE NOTICE 'Payment ID: %, User: %, Amount: %, Date: %', 
                     payment_record.payment_id, 
                     payment_record.user_name, 
                     payment_record.payment_amount, 
                     payment_record.payment_date;
    END LOOP;
END;
$$;


--удаление старых уведомлений 
CREATE OR REPLACE PROCEDURE delete_old_notifications()
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '30 days';

    RAISE NOTICE 'Old notifications (older than 30 days) have been deleted.';
END;
$$;


INSERT INTO notifications (user_id, is_read, content, created_at)
VALUES (1, FALSE, 'This is an old notification for testing', NOW() - INTERVAL '31 days');

CALL delete_old_notifications();

--создание юзера
CREATE OR REPLACE PROCEDURE create_user(
    input_name VARCHAR,
    input_email VARCHAR,
    input_password VARCHAR,  -- Новое поле пароля
    input_role_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Проверка, существует ли пользователь с таким email
    IF EXISTS (SELECT 1 FROM users WHERE email = input_email) THEN
        RAISE EXCEPTION 'User with email "%" already exists.', input_email;
    ELSE
        -- Вставка нового пользователя с паролем
        INSERT INTO users (name, email, password, role_id, created_at)
        VALUES (input_name, input_email, input_password, input_role_id, NOW());
        
        RAISE NOTICE 'User "%" with email "%" created successfully.', input_name, input_email;
    END IF;
END;
$$;


--чтение юзера
CREATE OR REPLACE PROCEDURE get_user(input_user_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT id, name, email, role_id, created_at INTO user_record
    FROM users
    WHERE id = input_user_id;

    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % does not exist.', input_user_id;
    ELSE
        RAISE NOTICE 'ID: %, Name: %, Email: %, Role ID: %, Created at: %', 
                     user_record.id, user_record.name, user_record.email, 
                     user_record.role_id, user_record.created_at;
    END IF;
END;
$$;
CALL get_user(1);

--обновление юзера
CREATE OR REPLACE PROCEDURE update_user(
    input_user_id INT,
    new_name VARCHAR,
    new_email VARCHAR,
    new_password VARCHAR DEFAULT NULL  -- Новое поле пароля, опционально
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Проверка, существует ли другой пользователь с таким email
    IF EXISTS (SELECT 1 FROM users WHERE email = new_email AND id != input_user_id) THEN
        RAISE EXCEPTION 'Another user with email "%" already exists.', new_email;
    ELSE
        -- Обновление данных пользователя
        UPDATE users
        SET name = new_name,
            email = new_email,
            password = COALESCE(new_password, password)  -- Обновление пароля, если передан
        WHERE id = input_user_id;

        -- Проверка, был ли обновлен хотя бы один пользователь
        IF NOT FOUND THEN
            RAISE NOTICE 'User with ID % does not exist.', input_user_id;
        ELSE
            RAISE NOTICE 'User ID % updated successfully.', input_user_id;
        END IF;
    END IF;
END;
$$;


CALL update_user(4, 'Jupdated', 'test@example.com');
SELECT * FROM users WHERE id = 4;

--удаление юзера 
CREATE OR REPLACE PROCEDURE delete_user(input_user_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users
    WHERE id = input_user_id;

    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % does not exist.', input_user_id;
    ELSE
        RAISE NOTICE 'User ID % deleted successfully.', input_user_id;
    END IF;
END;
$$;


CALL delete_user(4); 
SELECT * FROM users 
