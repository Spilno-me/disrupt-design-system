/**
 * Mock data for Partner Login Accounts page
 * @module partners/data/mock-login-accounts
 */

import type { LoginAccount } from "../types"

export const MOCK_LOGIN_ACCOUNTS: LoginAccount[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Smith",
    email: "james@draxindustries.com.au",
    status: "active",
    createdAt: new Date("2024-08-15"),
  },
]
