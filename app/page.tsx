"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Expense = {
  id: string;
  date: string;
  category: string;
  merchant: string;
  amount: number;
  notes?: string;
};

type RecurringPayment = {
  id: string;
  title: string;
  amount: number;
  nextDue: string;
  category: string;
};

const monthlyBudget: { total: number; categories: Record<string, number> } = {
  total: 2200,
  categories: {
    Groceries: 450,
    Housing: 950,
    Transportation: 250,
    Entertainment: 180,
    Utilities: 200,
    Health: 170
  }
};

const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-04-02",
    category: "Housing",
    merchant: "Urban Living",
    amount: 950,
    notes: "April rent"
  },
  {
    id: "2",
    date: "2024-04-04",
    category: "Groceries",
    merchant: "Whole Foods",
    amount: 86.42,
    notes: "Weekly staples"
  },
  {
    id: "3",
    date: "2024-04-06",
    category: "Transportation",
    merchant: "Metro Card",
    amount: 45,
    notes: "Monthly pass top-up"
  },
  {
    id: "4",
    date: "2024-04-08",
    category: "Entertainment",
    merchant: "Criterion Stream",
    amount: 19.99,
    notes: "Annual subscription"
  },
  {
    id: "5",
    date: "2024-04-09",
    category: "Health",
    merchant: "ZenFit Studio",
    amount: 58,
    notes: "Drop-in yoga"
  },
  {
    id: "6",
    date: "2024-04-10",
    category: "Utilities",
    merchant: "City Power",
    amount: 112.37,
    notes: "Electric"
  },
  {
    id: "7",
    date: "2024-04-11",
    category: "Groceries",
    merchant: "Trader Joe's",
    amount: 64.18
  },
  {
    id: "8",
    date: "2024-04-12",
    category: "Entertainment",
    merchant: "Local Cinema",
    amount: 27.5,
    notes: "Weekend movie"
  },
  {
    id: "9",
    date: "2024-04-13",
    category: "Transportation",
    merchant: "Lyft",
    amount: 18.3,
    notes: "Airport ride"
  }
];

const recurring: RecurringPayment[] = [
  {
    id: "r1",
    title: "Internet",
    amount: 79,
    nextDue: "2024-04-20",
    category: "Utilities"
  },
  {
    id: "r2",
    title: "Gym Membership",
    amount: 58,
    nextDue: "2024-04-25",
    category: "Health"
  },
  {
    id: "r3",
    title: "Spotify Family",
    amount: 17.99,
    nextDue: "2024-04-22",
    category: "Entertainment"
  }
];

const categories = Object.keys(monthlyBudget.categories);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quickAdd, setQuickAdd] = useState({
    date: "",
    category: "",
    merchant: "",
    amount: "",
    notes: ""
  });

  const summary = useMemo(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = expenses.length;
    const average = count ? totalSpent / count : 0;

    const byCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    const budgetUsage = categories.map((category) => {
      const allocated = monthlyBudget.categories[category] ?? 0;
      const spent = byCategory[category] ?? 0;
      const remaining = Math.max(allocated - spent, 0);
      const utilization = allocated ? Math.min((spent / allocated) * 100, 100) : 0;

      return {
        category,
        allocated,
        spent,
        remaining,
        utilization
      };
    });

    const filtered =
      selectedCategory === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === selectedCategory);

    return {
      totalSpent,
      count,
      average,
      budgetUsage,
      filtered
    };
  }, [expenses, selectedCategory]);

  const handleQuickAdd = () => {
    if (!quickAdd.date || !quickAdd.category || !quickAdd.merchant || !quickAdd.amount) {
      return;
    }

    const amount = Number.parseFloat(quickAdd.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      return;
    }

    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        date: quickAdd.date,
        category: quickAdd.category,
        merchant: quickAdd.merchant,
        amount,
        notes: quickAdd.notes.trim() || undefined
      },
      ...prev
    ]);

    setQuickAdd({ date: "", category: "", merchant: "", amount: "", notes: "" });
  };

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Expense Overview</h1>
          <p>Track where your money goes and stay ahead of your spending goals.</p>
        </div>
        <div className={styles.highlight}>
          <span>This month</span>
          <strong>{formatCurrency(summary.totalSpent)}</strong>
        </div>
      </header>

      <section className={styles.quickAdd}>
        <div className={styles.sectionHeader}>
          <h2>Quick Add</h2>
          <p>Log a new expense in seconds.</p>
        </div>
        <div className={styles.quickAddForm}>
          <label>
            <span>Date</span>
            <input
              type="date"
              value={quickAdd.date}
              onChange={(event) => setQuickAdd((prev) => ({ ...prev, date: event.target.value }))}
            />
          </label>
          <label>
            <span>Category</span>
            <select
              value={quickAdd.category}
              onChange={(event) =>
                setQuickAdd((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              <option value="">Select</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Merchant</span>
            <input
              type="text"
              placeholder="Where did you spend?"
              value={quickAdd.merchant}
              onChange={(event) =>
                setQuickAdd((prev) => ({ ...prev, merchant: event.target.value }))
              }
            />
          </label>
          <label>
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={quickAdd.amount}
              onChange={(event) => setQuickAdd((prev) => ({ ...prev, amount: event.target.value }))}
            />
          </label>
          <label className={styles.notesField}>
            <span>Notes</span>
            <input
              type="text"
              placeholder="Optional context"
              value={quickAdd.notes}
              onChange={(event) => setQuickAdd((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </label>
          <button type="button" onClick={handleQuickAdd}>
            Add Expense
          </button>
        </div>
      </section>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <h3>Total spent</h3>
          <strong>{formatCurrency(summary.totalSpent)}</strong>
          <p>{summary.count} tracked transactions</p>
        </article>
        <article className={styles.summaryCard}>
          <h3>Average expense</h3>
          <strong>{formatCurrency(summary.average)}</strong>
          <p>Keep everyday costs mindful</p>
        </article>
        <article className={styles.summaryCard}>
          <h3>Budget used</h3>
          <strong>
            {Math.min(Math.round((summary.totalSpent / monthlyBudget.total) * 100), 999)}%
          </strong>
          <p>of monthly allocation</p>
        </article>
        <article className={styles.summaryCard}>
          <h3>Remaining</h3>
          <strong>{formatCurrency(monthlyBudget.total - summary.totalSpent)}</strong>
          <p>before you hit your limit</p>
        </article>
      </section>

      <section className={styles.budgetPanel}>
        <div className={styles.sectionHeader}>
          <h2>Spending by category</h2>
          <p>Compare actual spend against your plan.</p>
        </div>
        <div className={styles.budgetList}>
          {summary.budgetUsage.map((item) => (
            <div key={item.category} className={styles.budgetRow}>
              <div className={styles.budgetRowHeader}>
                <span>{item.category}</span>
                <span>
                  {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${item.utilization}%` }} />
              </div>
              <span className={styles.remaining}>
                {item.remaining > 0
                  ? `${formatCurrency(item.remaining)} left`
                  : "Budget exceeded"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gridSplit}>
        <article className={styles.recurring}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming payments</h2>
            <p>Anticipate recurring charges before they land.</p>
          </div>
          <ul>
            {recurring.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>
                <div>
                  <strong>{formatCurrency(item.amount)}</strong>
                  <span>Due {new Date(item.nextDue).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.filters}>
          <div className={styles.sectionHeader}>
            <h2>Filter transactions</h2>
            <p>Focus on a single category to explore details.</p>
          </div>
          <div className={styles.filterList}>
            {[
              "All",
              ...categories
            ].map((category) => (
              <button
                key={category}
                type="button"
                className={
                  category === selectedCategory ? styles.filterActive : styles.filterButton
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.expenseTable}>
        <div className={styles.sectionHeader}>
          <h2>Transactions</h2>
          <p>
            {selectedCategory === "All"
              ? `Showing ${summary.filtered.length} expenses`
              : `Filtered by ${selectedCategory}`}
          </p>
        </div>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th align="left">Date</th>
                <th align="left">Merchant</th>
                <th align="left">Category</th>
                <th align="right">Amount</th>
                <th align="left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {summary.filtered.map((expense) => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.merchant}</td>
                  <td>
                    <span className={styles.categoryBadge}>{expense.category}</span>
                  </td>
                  <td align="right">{formatCurrency(expense.amount)}</td>
                  <td>{expense.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
