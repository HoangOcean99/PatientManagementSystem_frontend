export const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

    if (name.length <= 2) {
        return name[0] + "*@" + domain;
    }

    const visiblePart = name.slice(0, 3);
    const maskedPart = "*".repeat(name.length - 3);

    return visiblePart + maskedPart + "@" + domain;
};