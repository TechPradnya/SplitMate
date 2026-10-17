
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Settings,
} from "lucide-react";
import "./App.css";

type Expense = {
  id: string;
  name: string;
  amount: number;
  paid: string;
  icon: string;
};

type Group = {
  id: string;
  name: string;
  members: number;
  amount: number;
  icon: string;
};

const initialExpenses: Expense[] = [
  { id: "rent", name: "Rent", amount: 16000, paid: "You", icon: "🏠" },
  { id: "electricity", name: "Electricity", amount: 2000, paid: "Rahul", icon: "⚡" },
  { id: "wifi", name: "Wi-Fi", amount: 800, paid: "You", icon: "📶" },
  { id: "groceries", name: "Groceries", amount: 4000, paid: "Ananya", icon: "🛒" },
];

const initialGroups: Group[] = [
  { id: "pune-flatmates", name: "Pune Flatmates", members: 4, amount: 22800, icon: "🏠" },
  { id: "college-friends", name: "College Friends", members: 5, amount: 6450, icon: "🎓" },
  { id: "weekend-trip", name: "Weekend Trip", members: 3, amount: 3200, icon: "🏝️" },
];

const money = (value: number) =>
  "₹" + value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    readStorage("splitmate-expenses", initialExpenses)
  );

  const [groups, setGroups] = useState<Group[]>(() =>
    readStorage("splitmate-groups", initialGroups)
  );

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [modal, setModal] = useState<"expense" | "group" | "">("");
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState("");

  // Load saved expenses from the backend database when the dashboard opens.
  useEffect(() => {
    async function loadExpenses() {
      try {
        const response = await fetch("http://localhost:5000/api/expenses");
        if (!response.ok) throw new Error("Failed to load expenses");

        const data = await response.json();
        setExpenses(
          data.map((expense: {
            _id: string;
            name: string;
            amount: number;
            paid: string;
            icon: string;
          }) => ({
            id: expense._id,
            name: expense.name,
            amount: expense.amount,
            paid: expense.paid,
            icon: expense.icon,
          }))
        );
      } catch {
        setMessage("Could not load expenses. Make sure the backend is running.");
      }
    }

    loadExpenses();
  }, []);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yourShare = total / 4;

  useEffect(() => {
    try {
      localStorage.setItem("splitmate-expenses", JSON.stringify(expenses));
    } catch {
      setMessage("Could not save expenses in browser storage.");
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem("splitmate-groups", JSON.stringify(groups));
    } catch {
      setMessage("Could not save groups in browser storage.");
    }
  }, [groups]);

  // Restore the previously connected account if MetaMask is available.
  useEffect(() => {
    const ethereum = (window as Window & {
      ethereum?: {
        request: (args: { method: string }) => Promise<string[]>;
        on?: (event: string, callback: (...args: unknown[]) => void) => void;
        removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
      };
    }).ethereum;

    if (!ethereum) return;

    let active = true;

    ethereum.request({ method: "eth_accounts" })
      .then((accounts) => {
        if (active && accounts.length > 0) {
          setWallet(accounts[0]);
        }
      })
      .catch(() => {
        // Wallet is optional; the dashboard remains usable without it.
      });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setWallet(accounts?.[0] ?? "");
      if (accounts?.length) {
        setMessage("Wallet account updated.");
      } else {
        setMessage("Wallet disconnected.");
      }
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      active = false;
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  async function connectWallet() {
    const ethereum = (window as Window & {
      ethereum?: {
        request: (args: { method: string }) => Promise<string[]>;
      };
    }).ethereum;

    if (!ethereum) {
      setMessage("MetaMask was not detected. Install or enable its browser extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setMessage("MetaMask connected successfully.");
      } else {
        setMessage("No wallet account was returned.");
      }
    } catch {
      setMessage("Wallet connection cancelled or rejected.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("Please enter a name.");
      return;
    }

    if (modal === "expense") {
      const parsedAmount = Number(amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        setMessage("Enter an expense amount greater than zero.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            amount: parsedAmount,
            paid: "You",
            icon: "🧾",
            groupId: "Pune Flatmates",
          }),
        });

        const savedExpense = await response.json();
        if (!response.ok) {
          throw new Error(savedExpense.message || "Could not save expense");
        }

        const expense: Expense = {
          id: savedExpense._id,
          name: savedExpense.name,
          amount: savedExpense.amount,
          paid: savedExpense.paid,
          icon: savedExpense.icon,
        };

        setExpenses((current) => [expense, ...current]);
        setMessage(`${trimmedName} saved to the database successfully.`);
      } catch {
        setMessage("Could not save expense. Check that the backend is running.");
        return;
      }
    }

    if (modal === "group") {
      if (groups.some((group) => group.name.toLowerCase() === trimmedName.toLowerCase())) {
        setMessage("A group with that name already exists.");
        return;
      }

      const group: Group = {
        id: createId(),
        name: trimmedName,
        members: 1,
        amount: 0,
        icon: "👥",
      };

      setGroups((current) => [...current, group]);
      setMessage(`${trimmedName} created successfully.`);
    }

    setName("");
    setAmount("");
    setModal("");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">₹</span> Split<span>Mate</span>
        </div>

        <p className="section-label">WORKSPACE</p>

        <div className="nav selected">
          <LayoutDashboard size={19} /> Overview
        </div>
        <div className="nav">
          <Users size={19} /> My Groups
        </div>
        <div className="nav">
          <Receipt size={19} /> Expenses
        </div>
        <div className="nav">
          <ArrowUpRight size={19} /> Settlements
        </div>
        <div className="nav">
          <History size={19} /> Transaction History
        </div>

        <div className="wallet-box">
          <Wallet size={25} />
          <h3>{wallet ? "Wallet connected" : "Your money, together"}</h3>
          <p>
            {wallet
              ? `${wallet.slice(0, 8)}...${wallet.slice(-4)}`
              : "Connect MetaMask to explore blockchain settlements."}
          </p>
          <button className="outline-btn" onClick={connectWallet}>
            {wallet ? "Connected ✓" : "Connect Wallet"}
          </button>
        </div>

        <div className="nav">
          <Settings size={19} /> Settings
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="crumb">
            Workspace / <strong>Overview</strong>
          </span>
          <button className="wallet-btn" onClick={connectWallet}>
            <Wallet size={17} />
            {wallet ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </header>

        {message && (
          <button
            className="notice"
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
          >
            {message} ×
          </button>
        )}

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR MONEY, TOGETHER</p>
            <h1>Good morning, Pradnya 👋</h1>
            <p>Here's what's happening with your shared expenses.</p>
          </div>
          <button className="primary" onClick={() => setModal("expense")}>
            <Plus size={18} /> Add expense
          </button>
        </section>

        <section className="stats">
          <article className="stat blue">
            <span>Total expenses</span>
            <Users />
            <h2>{money(total)}</h2>
            <small>Across shared expenses</small>
          </article>

          <article className="stat purple">
            <span>Your share</span>
            <Wallet />
            <h2>{money(yourShare)}</h2>
            <small>Illustrative equal split</small>
          </article>

          <article className="stat orange">
            <span>You owe</span>
            <ArrowUpRight />
            <h2>{money(1250)}</h2>
            <small>Demo balance</small>
          </article>

          <article className="stat green">
            <span>You're owed</span>
            <ArrowDownLeft />
            <h2>{money(2400)}</h2>
            <small>Demo balance</small>
          </article>
        </section>

        <section className="columns">
          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Your groups</h2>
                <p>Manage expenses together</p>
              </div>
              <button className="text-btn" onClick={() => setModal("group")}>
                <Plus size={16} /> Create group
              </button>
            </div>

            {groups.map((group) => (
              <div className="group-row" key={group.id}>
                <span className="group-icon">{group.icon}</span>
                <div className="grow">
                  <strong>{group.name}</strong>
                  <small>{group.members} members</small>
                </div>
                <strong>{money(group.amount)}</strong>
              </div>
            ))}
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Settlement overview</h2>
                <p>Your shared balances</p>
              </div>
              <ArrowUpRight />
            </div>

            <div className="balance">
              <small>Net balance</small>
              <h2>+₹1,150</h2>
              <p>Illustrative demo balance</p>
            </div>

            <button className="primary full" onClick={connectWallet}>
              {wallet ? "Wallet connected" : "Connect wallet to settle"}
            </button>

            <div className="blockchain">
              <Wallet size={20} />
              <div>
                <strong>Blockchain settlements</strong>
                <small>
                  {wallet ? "Wallet connected · No settlement submitted" : "Testnet integration comes next"}
                </small>
              </div>
            </div>
          </article>
        </section>

        <article className="panel expenses">
          <div className="panel-head">
            <div>
              <h2>Recent expenses</h2>
              <p>Your latest shared spending</p>
            </div>
          </div>

          <div className="table-head">
            <span>Expense</span>
            <span>Group</span>
            <span>Paid by</span>
            <span>Amount</span>
          </div>

          {expenses.map((expense) => (
            <div className="expense-row" key={expense.id}>
              <span>{expense.icon}　{expense.name}</span>
              <span>Pune Flatmates</span>
              <span>{expense.paid}</span>
              <strong>{money(expense.amount)}</strong>
            </div>
          ))}

          {expenses.length === 0 && (
            <p>No expenses yet. Click Add expense to get started.</p>
          )}
        </article>

        <footer>SplitMate · Shared expenses made simple.</footer>
      </main>

      {modal && (
        <div className="backdrop" onClick={() => setModal("")}>
          <form
            className="dialog"
            onSubmit={submit}
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{modal === "expense" ? "Add an expense" : "Create a group"}</h2>
            <p>
              {modal === "expense"
                ? "Record a shared payment."
                : "Bring your people together."}
            </p>

            <label>
              {modal === "expense" ? "Expense name" : "Group name"}
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter a name"
                autoFocus
              />
            </label>

            {modal === "expense" && (
              <label>
                Amount in rupees
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="1200"
                />
              </label>
            )}

            <button className="primary full" type="submit">
              {modal === "expense" ? "Save expense" : "Create group"}
            </button>

            <button
              className="cancel"
              type="button"
              onClick={() => {
                setModal("");
                setName("");
                setAmount("");
              }}
            >
              Cancel
            </button>

            <small>
              Expenses are saved to the SplitMate database. Groups are currently stored in this browser.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}
