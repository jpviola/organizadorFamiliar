
import { pgTable, text, timestamp, boolean, uuid, pgEnum, decimal } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "member"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk ID or custom ID
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  role: roleEnum("role").default("member"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("todo").notNull(), // todo, in_progress, done
  priority: text("priority").default("medium").notNull(), // low, medium, high
  assigneeId: text("assignee_id"), // Clerk ID or custom ID
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  location: text("location"),
  type: text("type").default("general"), // school, work, vacation, etc.
  tripId: uuid("trip_id"), // Optional link to a trip
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // breakfast, lunch, dinner, snack
  description: text("description").notNull(),
  assignedTo: text("assigned_to"), // Who cooks?
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // groceries, utilities, education, etc.
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdBy: text("created_by"), // Clerk ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  status: text("status").default("planned"), // planned, ongoing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


