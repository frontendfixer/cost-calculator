ALTER TABLE `cc_daily_expense_list` MODIFY COLUMN `category` enum('food','grocery','entertainment','other','salary','loan','investment') NOT NULL DEFAULT 'other';--> statement-breakpoint
ALTER TABLE `cc_daily_expense_list` MODIFY COLUMN `payment_method` enum('cash','online') NOT NULL DEFAULT 'cash';--> statement-breakpoint
ALTER TABLE `cc_daily_expense_list` MODIFY COLUMN `status` enum('active','inactive','deleted') DEFAULT 'active';