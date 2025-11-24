export const parseMedicamentos = (input) => {
    if (!input) return [];

    return input.split(",").map(txt => {
        const limpio = txt.trim();
        if (!limpio) return null;

        const partes = limpio.split(" ");
        const nombre = partes[0] || "";
        const dosis = partes[1] || "";
        const frecuencia = partes.slice(2).join(" ") || "";

        return { nombre, dosis, frecuencia };
    }).filter(x => x);
};

export const parseAntecedentes = (body) => {
    const parse = (campo) => {
        if (!campo) return [];
        return campo
            .split(",")
            .map(x => x.trim())
            .filter(x => x.length > 0);
    };

    return {
        familiares: parse(body.antecedentes_familiares),
        personales: parse(body.antecedentes_personales),
        quirurgicos: parse(body.antecedentes_quirurgicos)
    };
};

export const parseAlergias = (input) => {
    if (!input) return [];

    return input
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);
};