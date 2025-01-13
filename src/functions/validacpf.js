// const { app } = require('@azure/functions');

// app.http('validacpf', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         context.log(`Http function processed request for url "${request.url}"`);

//         const name = request.query.get('name') || await request.text() || 'world';

//         return { body: `Hello, ${name}!` };
//     }
// });

const { app } = require("@azure/functions");

app.http("validacpf", {
    methods: ["POST"], // habilita apenas o verbo http POST
    authLevel: "anonymous",
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);

        try {
            const body = await request.json();

            // verifica se a key "cpf" está presente no body da requisição
            if (!body.cpf && typeof body.cpf !== "string") {
                return {
                    status: 400,
                    body: JSON.stringify({
                        error: "Por favor, informe o CPF no formato xxx.xxx.xxx-xx.",
                    }),
                };
            }

            const cpf = body.cpf;
            const isValid = isValidCPF(cpf);

            return {
                status: 200,
                body: JSON.stringify({
                    cpf,
                    isValid,
                    message: isValid
                        ? "CPF válido e não consta na base de dados de débitos."
                        : "CPF é inválido.",
                }),
            };
        } catch (error) {
            return {
                status: 400,
                body: JSON.stringify({
                    error: "Formato inválido (informe o CPF no padrão xxx.xxx.xxx-xx.) ou body não está presente.",
                }),
            };
        }
    },
});

// funcao auxiliar que contém a regra de negócio que valida CPF
function isValidCPF(cpf) {
    // aplica regex para remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // validação usando os dígitos verificadores
    const calc = (n) =>
        [...cpf]
            .slice(0, n)
            .reduce((acc, digit, index) => acc + digit * (n + 1 - index), 0) %
        11;

    const digit1 = calc(9) < 2 ? 0 : 11 - calc(9);
    const digit2 = calc(10) < 2 ? 0 : 11 - calc(10);

    return Number(cpf[9]) === digit1 && Number(cpf[10]) === digit2;
}
