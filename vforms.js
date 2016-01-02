/*
** VFORMS v1.0a
** Script para validacao facil de formularios
** Desenvolvido por Samuel Corradi - http://www.samuelcorradi.com.br
** Licenciado sob Creative Commons by-sa
** http://creativecommons.org/licenses/by-sa/2.5/br/
*/

vforms = (function(escope) {

	/**
	 * Adiciona novos tipos ao objeto.
	 */
	escope.setType = function(type, mask, fun, errormsg)
	{

		if( mask ) escope.masks[type] = mask;

		if( fun ) escope.validators[type] = fun;

		if( errormsg ) escope.errors[type] = errormsg;

	};
	
	escope.masks = {

		number: "##########################",

		letters: "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",

		phone: "(##) ####-####",

		cpf: "###.###.###-##",

		date: "##/##/####",

		hour: "##:##",

		cep: "#####-###",

		creditcard: "#### #### #### ####"

	};

	/**
	 * Error mensagens for each
	 * validation rule.
	 */
	escope.errors = {

		number: "The field allows only numbers",

		email: "Enter the e-mail address correctly",

		cep: "Enter the CEP number correctly",

		cpf: "CPF number invalid",

		confirm: "Enter the confirmation correctly",

		date: "Enter the date correctly",

		required: "The field must be filled"

	};

	escope.validators = {

		number: function(v)
		{
			return t.replace(/\d*/,"")==""
		},

		email: function(t)
		{
			return t.replace(/^\w[\w\.\+-]+@\w[\w\.\+-]+\.\w\w+$/,"")==""
		},

		cpf: function(t)
		{

			function validaCPF(cpf)
			{

				if (cpf.length < 11)
				{
					return false;
				}

				var nonNumbers = /\D/;

				if (nonNumbers.test(cpf))
				{
					return false;
				}

				if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
				{
					return false;
				}

				var a = [];

				var b = new Number;

				var c = 11;

				for (i=0; i<11; i++)
				{

					a[i] = cpf.charAt(i);

					if (i < 9)
					{
						b += (a[i] * --c);
					}

				}

				a[9] = ((x = b % 11) < 2) ? 0 : 11 - x;

				b = 0;

				c = 11;

				for (y=0; y<10; y++)
				{
					b += (a[y] * c--)
				}

				a[10] = ((x = b % 11) < 2) ? 0 : 11 - x;

				if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]))
				{
					return false;
				}

				return true;

			}

			try
			{

				if(t=="")
				{
					return true;
				}

				return validaCPF(t.replace(/\D/g,""));

			}
			catch(e)
			{
				alert(e);
			}

		},

		cep: function(t)
		{
			return t.replace(/^\d{5}-\d{3}$/,"")=="";
		},

		confirm: function(t,i)
		{
			return i.value==i.form.elements[i.name+"2"].value;
		},

		date: function(t)
		{

			if(t=="")
			{
				return true;
			}

			var dat=/^[0123]?\d\/[01]?\d\/\d{4}$/;

			if(! dat.test(t) )
			{
				return false;
			}

			dat = t.split("/");

			var d = new Date();

			d.setFullYear(parseFloat(dat[2]));

			d.setMonth(parseFloat(dat[1])-1);

			d.setDate(parseFloat(dat[0]));

			return d.getMonth()==parseFloat(dat[1])-1;

		},

		required: function(t)
		{
			return t!="";
		}

	};

	escope.Form = function(form_el, onerror)
	{

		var field_list = form_el.getElementsByTagName('input');

		var that = this;

		this.ferros = [];

		/**
		 * Função para validar o formulário.
		 */
		this.validate = function(onerror)
		{

			this.ferros = [];

			/*
			 * Função padrão para o caso
			 * de erros serem encontrados.
			 * Ela é usada caso não se tenha
			 * passado uma função onerror.
			 */
			onerror = onerror || function(errorlst) {

				var txterr="Por favor, corrija os seguintes erros:\n";

				// for(var i=0;i<errorlst.length;i++)
				// {
				// 	txterr += " * " + $.trim(er[i][0].parentNode.innerHTML.replace(/<[^>]*>| *: */g,"")) + ": "+er[i][1]+"\n";
				// }

				alert(txterr);

			}

			var lbs = form_el.getElementsByTagName("label");

			for(var x=0;x<lbs.length;x++)
			{
				console.log(lbs[x]);

				removeClass(lbs[x], "verror");

				removeClass(lbs[x], "valid");

				var elname = lbs[x].getAttribute("for");

				var el = document.getElementById(elname);

				var clslst = lbs[x].className.split(" ");

				for(var i = 0; i<clslst.length; i++)
				{

					try
					{

						var fn = escope.validators[clslst[i]];

						/*
						 * Caso tenha encontrado erro.
						 */
						if( ! fn(el.value) )
						{

							/*
							 * Retirei daqui o esquema de salvar
							 * a informação de todos os erros
							 * encontrados em todos campo para
							 * colocar essas informações como
							 * atributos dos campos.
							 */

							el.setAttribute("errormessage", escope.errors[clslst[i]]); // Define mensagem de erro no campo.

							this.ferros.push(el); // Adiciona campo a lista de campos com erro.

							continue; // Se já encontrou um erro, contabiliza e vai para o próximo.
						
						}

					}
					catch(e)
					{

					}

				}

				addClass(el, ( this.ferros.indexOf(el)<0 ) ? "valid" : "verror");

			}

			if(this.ferros.length>0)
			{

				onerror(this.ferros);

				return false;

			}

		}

		/**
		 * Verifica se um elemento possui
		 * uma classe específica.
		 */
		function hasClass(el, cls)
		{

			return ( el.className.split(" ").indexOf(cls)>-1 ) ? true : false;

		}

		/*
		 * Função para remoção de
		 * classes.
		 */
		function removeClass(el, cls)
		{

			if( ! hasClass(el, cls) ) return;

			var clslst = el.className.split(" ");

			clslst.splice(clslst.indexOf(cls), 1);

			el.className = clslst.join(" ");

		}

		/**
		 * Adicione classe a um elemento.
		 */
		function addClass(el, cls)
		{

			if( ! hasClass(el, cls) ) return;

			var clslst = el.className.split(" ");

			clslst.push(cls);

			el.className = clslst.join(" ");

		}

		for (var i=0; i<field_list.length; i++)
		{

			if( ! field_list[i].hasAttribute("type") ) continue; // Se o campo não definiu um tipo não faz nada.

			if ( field_list[i].getAttribute("type") == 'submit')
			{
				field_list[i].addEventListener("click", function(e)
				{
					that.validate(onerror);
				});
			}
			else
			{
				field_list[i].onkeypress = function(ev)
				{
					return that.mask(ev);
				};
				
			}
		}

	};

	escope.Form.prototype = {

		mask : function(ev)
		{

			var el = ev.target;

			if( ! escope.masks[el.getAttribute("type")] ) return true;

			var mask = escope.masks[el.getAttribute("type")];

			key = ev.which || ev.keyCode || e.key || e.char;

			if( [0, 8, 9, 13, 36, 37, 38, 40].indexOf(key)!=-1 )
			{
				return true;
			}

			var strlen = el.value.length;

			if (strlen >= mask.length) return false;

			/*
			 * Verify of it's a number.
			 */
			if (mask.charAt(strlen) == '#')
			{
				return (key>47 && key<58);
			}
			else
			{

				if (mask.charAt(strlen) == '!')
				{
					return ((key>96 && key<123) || (key>64 && key<91)); // return true;
				}
				
				for (var c=strlen; c<mask.length; c++)
				{
					if (mask.charAt(c) != '#' && mask.charAt(c) != '!')
					{
						el.value = el.value + mask.charAt(c);
					}
					else if (mask.charAt(c) == '!')
					{
						return true;
					}
					else
					{
						return (key>47 && key<58);
					}
				}

			}

		},

	};

	var forms = document.getElementsByClassName("vform");

	for (var i=0; i<forms.length; i++)
	{
		new escope.Form(forms[i]);
	}

	return escope;
	
})(window.vforms || {});
