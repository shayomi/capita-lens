import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

/**
 * A business profile owned by a user. MVP assumes one active business per
 * user, but the schema supports many for future multi-entity accounts.
 */
export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  tradingName: text("trading_name"),
  registrationNumber: text("registration_number"),
  country: text("country").default("United Kingdom"),
  address: text("address"),
  industry: text("industry"),
  subSector: text("sub_sector"),
  legalStructure: text("legal_structure"), // sole_trader | partnership | ltd | llp | charity | cic
  yearsTrading: integer("years_trading"),
  employees: integer("employees"),
  annualTurnover: numeric("annual_turnover", { precision: 14, scale: 2 }),
  annualProfit: numeric("annual_profit", { precision: 14, scale: 2 }),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const businessesRelations = relations(businesses, ({ one }) => ({
  owner: one(users, {
    fields: [businesses.userId],
    references: [users.id],
  }),
}));

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
