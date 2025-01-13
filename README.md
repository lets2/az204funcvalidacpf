# VALIDA CPF

## Para iniciar a function localmente

```bash
func start --build
```

## Exemplo de CPF válido:

```bash
curl -X POST http://localhost:7071/api/validacpf -H "Content-Type: application/json" -d '{"cpf":"084.222.180-89"}'
```

## Exemplo de CPF inválido:

```bash
curl -X POST http://localhost:7071/api/validacpf -H "Content-Type: application/json" -d '{"cpf":"111.222.333-44"}'
```

## Para publicar na azure

```bash
func azure functionapp publish <nomedafuncion>
```

-   Obs: Após publicar, precisa ir no portal da azure em App keys, pegar a chave default e passar como parâmetro na requisição:

```
    "code"="app-key-default"
```
