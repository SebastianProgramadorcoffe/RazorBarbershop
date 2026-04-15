#Primer ejercicio 

name = input("Ingrese su nombre: ")
age = int(input("Ingrese su edad: "))
faviritefood = input("Cual es su comida favorita?: ")

print(f"""\"Hola! Mi nombre es {name.capitalize()}. Yo tengo {age} años, y mi
comida favorita es {faviritefood.capitalize()}\"""")

#Segundo ejercicio 
fullName = input("Ingrese su nombre completo: ")
nameLimpio = fullName.replace(" ", "")

print(nameLimpio)
print(f"\"Hola! {fullName.title()}! Tu nombre tiene {len(nameLimpio)} letras, excluyendo los espacios.\"")

#Tercer ejercicio
increaseSalesPercent = float(input("Ingrese el porcentaje de aumento: "))   
revenueGrowthPercent = float(input("Ingrese el porcentaje de crecimiento: "))

print(f"""\"Las ventas de la empresa láctea aumentaron un
 {increaseSalesPercent:.2f}% y los ingresos crecieron un {revenueGrowthPercent:.2f}%\"""")

#Cuarto ejercicio
#En este ejercicio utilizamos una tecnica que denomidada slicing"recortar-cortar" 
#donde podemos extraer partes de una cadena cadena[inicio:fin:paso]
# La cadena con el formato correcto para que el mensaje tenga sentido
secretMessage = "aS!Ir waQm  VL!eDafrcnXinn=gS .P,yytahgoln.!"

# Aplicamos el slicing: Empezamos en 3, vamos hasta el final, saltando de 2 en 2
mensaje_decodificado = secretMessage[3::2]
print(mensaje_decodificado)

#Quinto ejercicio
#Aplico la funcion .split para poder dividir las palabras de el texto ingresado,
#  al utilizar la funcion len para contar las palabras que fueron divididas y saber cuantas palabras tenemos 
text = input("Ingrese una frase: ")
def conteodePalabras(text):
    divicionPalabras = text.split(" ")
    print(f"""\"Numero de palabras en la frase: {len(divicionPalabras)}\"""")
conteodePalabras(text)
#
#Sexto Ejercicio 
word = input("Ingrese su nombre: ")
def remplazar(word):
    remplazado = word.replace("a","e")
    print(f"\"{remplazado}\"")

remplazar(word)

sentence = input("Ingrese el texto: ")
def intercambio(sentece):
    separado_texto = sentence.split(" ")
    tex_intercambiado = " ".join(reversed(separado_texto))
    print(f"\"{tex_intercambiado}\"")
intercambio(sentence)