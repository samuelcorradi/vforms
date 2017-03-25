# 1. O que é

**vForms** é um pequeno script não-obstrusivo para validação de formulários do lado cliente.
Existem diversos validadores de formulários em Javascript, porém é dificil encontrar aquele que seja realmente útil em qualquer situação. Dos que já encontrei, sempre algum se destaca em determinada tarefa, mas falha em outras. Meu intuito então é: *unir em um só validador tudo que encontrei de melhor nos validadores que já utilizei*.

Atualmente o **vForms** é capaz de:

- Criar com extrema facilmente qualquer máscara para formatar campos;
- Adicionar facilmente novas funcões Javascript de validação;
- Exibir mensagens de erro personalisadas para cada função de validação;
- Sinalizar os campos que falharam durante a validação;
- Não-obstrusivo. Controlado somente por atributos **class**.

# 2. Como utilizar

1. Insira no head o caminho para o arquivo **vForms**.
```html
<script src="vforms.js" type="text/javascript"></script>
```
2. Defina a classe **vForms** para os formulários que você deseja usar a validação.
```html
<form class="vforms"></form>
```
3. Defina nas tags label do seu formulário as classes referentes as máscaras e a validação de valores. OBS: O script trabalhará com o campo do label através do atributo **for**. Por tando, para que o **vForms** funcione, não deixe de colocar o atributo **for** em seus labels.
```html
<label for="input_telefone" class="required phone" />
```
4. Editando o arquivo do **vForms** você pode adicionar novas mascaras e funções de validação de valores.

# 3. Funcionalidades

**vForms** é capaz de duas coisas que, na minha opinião, são fundamentais para o funcionamento eficaz de formulários: *validar* e *mascarar* os valores digitados ainda no lado cliente. Por ser escrito em JavaScript, **vForms** não faz a validação do lado servidor. Você terá que fazer essa parte de acordo com a linguagem que seu servidor suporte.

## Criando máscaras
Criar máscaras é fácil como preencher um campo.
Para criar sua máscara, adicione no local correto no código do **vForms** um nome para a máscara e seu formato.
Basta ter em mente que '#' significa números e '!' significa letras. O que não for um desses caracteres, será ele mesmo.

**Por exemplo:**

```javascript
escope.masks = {
"phone": ["(##) ####-####"],
"creditcard": ["#### #### #### ####"]
}
```

## Criando validações
Ao contrário das máscaras, para criar uma validação é necessário ter conhecimento sobre JavaScript, pois a função que validará o campo, logicamente, deverá ser escrita nessa linguagem.
Para inserir uma nova validação, crie no local destinado a função que irá validar determinado valor (como e-mails, CPFs, etc.) e crie seu alias na matriz 'validadores' dentro do código. Esse alias será usado dentro do atributo 'class' da tag label para chamar a função.
Ou seja, declare uma classe na tag label do campo desejado (com o mesmo nome do alias criado) para chamar a função quando o formulário for submetido.
Agora basta criar uma mensagem de erro para caso a validação não retorne verdadeiro. Utilize o nome do alias para definir para qual função essa mensagem de erro pertence.

**Por exemplo:**

```javascript
function vEmail(t)
{
	return t.replace(/^\w[\w\.\+-]+@\w[\w\.\+-]+\.\w\w+$/, "") == ""
}
```

```javascript
escope.validators = {
"vEmail": vEmail,
}
```

```javascript
escope.errors = {
"vEmail":"digite corretamente o e-mail"
}
```

# 4. Demonstração

## Máscara para telefones
```html
<form class="vForms">
<label for="input_telefone" class="phone">Telefone:</label><br />
<input id="input_telefone" name="input_telefone" maxlength="14" />
</form>
```

## Máscara para cartões de crédito
```html
<form class="vForms">
<label for="input_cartao" class="creditcard">Número do cartão:</label><br />
<input id="input_cartao" name="input_cartao" maxlength="19" />
</form>
```

## Validação para campos obrigatórios
```html
<form class="vForms">
<label for="input_nome" class="required">Nome:</label><br />
<input id="input_nome" name="input_nome" maxlength="45" />
<input type="submit" value="Testar" />
</form>
```

## Validação para campos de e-mail
```html
<form class="vForms">
<label for="input_email" class="email">E-mail:<br />
<input id="input_email" name="input_email" maxlength="45" />
</label>
<input type="submit" value="Testar" />
</form>
```
  
# 5. Histórico de alterações

**v1.0a**

- Corrigido bug que fazia campos sem máscara procurar por alguma função de máscara;
- Incluída opção para adicionar uma marcação em campos obrigatórios.

**v1.0**

- Além dos inputs, funciona agora também com textareas;
- Substituído o esquema de usar expressões regulares para criar máscaras;
- Funciona mesmo que o campo não esteja dentro da tag label. **Exemplo**:
```html
<label><input /></label>
```
ou 
```html
<label></label><input />
```
- Mascara o campo ao mesmo tempo que este é preenchido;
- Mensagens de erro passam por um 'trim' para serem exibidas;
- A busca pelo campo de texto agora é através do **for** do label.

# 6. Dependências

**vForms** é escrito em JavaScript *puro*, não utiliza qualquer framework. Sendo assim, *não há dependencias*.