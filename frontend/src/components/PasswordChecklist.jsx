const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
];

function PasswordChecklist({ password }) {
  return (
    <ul className="password-checklist">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li key={rule.label} className={passed ? "valid" : "invalid"}>
            <span className="checklist-icon">{passed ? "✓" : "✗"}</span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordChecklist;
export { PASSWORD_RULES };