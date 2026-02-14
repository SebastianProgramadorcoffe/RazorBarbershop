# PI = 3.1416
# print('El valor de Pi es: ', PI)

# print()

# NOMBRE_BASE_DATOS = "Tienda_Online_db"
# print('Nombre bade de datos: ', NOMBRE_BASE_DATOS)

libro = "Leí el libro 'Return to Moria'"
#Usando comilla triple
menu = """
MENÚ DEL DÍA
----------------------
1. Tacos peruanos mexicanos
2. Enchiladas mexicanas
3. Aguacate al horno
"""
print(menu)
print()
#Error ~> mensaje = "Ella dijo "hola" al entrar"
mensaje = "Ella dijo \"hola\" al entrar"
print(mensaje)

mensaje = "Ella \nes mala"
print(mensaje)

#unir cadenas, concatenación 
nombre = "Nate"
apellido = "Gentile"
print(nombre + " " + apellido)
print()
nombrea = 'Ana'
edad = 20
print(f"Hola {nombrea}, tienes {edad}")
presentacion = f"Cuando ", nombre, "estaba en sus ", edad
print(presentacion) 
presentacion2 = f" cuando {nombrea}, tenia {edad +2} años, conocio a {nombre}"
print(presentacion2)
 
print()
print("***conteo*** ")
#funcion len()
tamanio = len(presentacion2)
print(f"Tamaño de la string", tamanio)

# Los elementos de una cadena o string no se pueden remplazar, solo se puede tomar el 
# valor agregarle o concatenarle algo y almacenar este nuevo valor en otra cadena.
nombre_animal = "oso"
nombre_agregado = nombre_animal + "s"
print(nombre_agregado)
#Mejor concatenacion
nombre_agregado = f"{nombre_animal}s"
print(nombre_agregado)

