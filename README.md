# MDiSYBD
* GoshCash
* Kazakevich Georgy
* 253504

![bd_lab2_ready](https://github.com/user-attachments/assets/1f22b4c8-bb8f-4abe-8e8f-fe04ae2dfa7b)


## Entities
### 1. User
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the user.
- `name` (VARCHAR, NOT NULL) — user's name.
- `email` (VARCHAR, UNIQUE, NOT NULL) — user's email.
- `password` (VARCHAR, NOT NULL) — hashed password.
- `role` (ENUM: 'admin', 'creator', 'backer') — user's role on the platform.
- `created_at` (DATETIME, NOT NULL) — date of user registration.

### 2. Project
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the project.
- `user_id` (FK, INT, NOT NULL) — reference to the user (creator).
- `title` (VARCHAR, NOT NULL) — project title.
- `description` (TEXT, NOT NULL) — project description.
- `goal_amount` (DECIMAL, NOT NULL) — fundraising goal.
- `status` (ENUM: 'pending', 'approved', 'rejected') — status of the project.
- `category_id` (FK, INT, NOT NULL) — reference to the project category.
- `created_at` (DATETIME, NOT NULL) — date of project creation.

### 3. Category
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the category.
- `name` (VARCHAR, NOT NULL) — category name.

### 4. Reward
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the reward.
- `project_id` (FK, INT, NOT NULL) — reference to the project.
- `description` (VARCHAR, NOT NULL) — description of the reward.
- `amount_required` (DECIMAL, NOT NULL) — amount required to claim the reward.

### 5. Payment
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the payment.
- `user_id` (FK, INT, NOT NULL) — reference to the user (backer).
- `project_id` (FK, INT, NOT NULL) — reference to the project.
- `amount` (DECIMAL, NOT NULL) — amount contributed.
- `payment_date` (DATETIME, NOT NULL) — date of the payment.

### 6. Update
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the update.
- `project_id` (FK, INT, NOT NULL) — reference to the project.
- `title` (VARCHAR, NOT NULL) — title of the update.
- `content` (TEXT, NOT NULL) — content of the update.
- `created_at` (DATETIME, NOT NULL) — date of update creation.

### 7. Moderation
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the moderation record.
- `project_id` (FK, INT, NOT NULL) — reference to the project.
- `admin_id` (FK, INT, NOT NULL) — reference to the admin reviewing the project.
- `status` (ENUM: 'approved', 'rejected') — moderation result.
- `review` (TEXT) — review notes or comments.
- `review_date` (DATETIME, NOT NULL) — date of moderation.

### 8. Comment
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the comment.
- `user_id` (FK, INT, NOT NULL) — reference to the user (comment author).
- `project_id` (FK, INT, NOT NULL) — reference to the project.
- `content` (TEXT, NOT NULL) — comment text.
- `created_at` (DATETIME, NOT NULL) — date of comment creation.

### 9. UserLog
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the log entry.
- `user_id` (FK, INT, NOT NULL) — reference to the user.
- `action` (VARCHAR, NOT NULL) — description of the action.
- `action_date` (DATETIME, NOT NULL) — date and time of the action.

### 10. Role
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the role.
- `name` (VARCHAR, NOT NULL) — name of the role (admin, creator, backer).

### 11. Notification
- `id` (PK, INT, AUTO_INCREMENT) — unique identifier for the notification.
- `user_id` (FK, INT, NOT NULL) — reference to the user receiving the notification.
- `content` (TEXT, NOT NULL) — message or content of the notification.
- `is_read` (BOOLEAN, NOT NULL, DEFAULT: FALSE) — indicates whether the notification has been read.
- `created_at` (DATETIME, NOT NULL) — date and time when the notification was created.


## Fuctionality
### Admin
* Manage all users (create, update, delete, view).
* Approve or reject projects (moderation functionality).
* Access user logs to review actions.
* Manage system-wide notifications.
* View and manage all projects.
* Full access to all reports and financial data.
### Creator
* Create, update, and delete their own projects.
* Post updates for their projects to keep backers informed.
* View the contributions to their project and manage rewards.
* Access basic user interaction logs related to their project.
* View comments on their project and reply to them.
### Backer
* View and search for active projects.
* Contribute funds to projects.
* Claim rewards based on their contributions.
* Leave comments and feedback on projects they’ve supported.
* Receive notifications about updates to the projects they’ve backed.
