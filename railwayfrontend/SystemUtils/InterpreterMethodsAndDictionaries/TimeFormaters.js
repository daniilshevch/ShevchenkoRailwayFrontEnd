const formatDM_HM = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);

    const dm = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(d);
    const hm = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
    return `${dm}, ${hm}`; // "14 лютого, 18:36"
};
export {formatDM_HM};