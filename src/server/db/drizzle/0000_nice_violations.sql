CREATE TABLE `cc_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `cc_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `cc_daily_expense_list` (
	`id` varchar(32) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`date` timestamp(3) NOT NULL,
	`amount` int NOT NULL,
	`category` enum('Food','Grocery','Entertainment','Other') NOT NULL DEFAULT 'Other',
	`payment_method` enum('Cash','Online','Other') NOT NULL DEFAULT 'Cash',
	`title` varchar(255) NOT NULL,
	CONSTRAINT `cc_daily_expense_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cc_session` (
	`session_token` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `cc_session_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `cc_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`created_at` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `cc_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cc_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `cc_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
ALTER TABLE `cc_account` ADD CONSTRAINT `cc_account_userId_cc_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `cc_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cc_daily_expense_list` ADD CONSTRAINT `cc_daily_expense_list_user_id_cc_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cc_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cc_session` ADD CONSTRAINT `cc_session_userId_cc_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `cc_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `cc_account` (`userId`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `cc_session` (`userId`);