const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
];

function PasswordChecklist({ password }) {
  if (!password) return null;

  const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password));

  if (failedRules.length === 0) return null;

  return (
    <ul className="password-checklist">
      {failedRules.map((rule) => (
        <li key={rule.label} className="invalid">
          <span className="checklist-icon">✕</span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

export default PasswordChecklist;
export { PASSWORD_RULES };