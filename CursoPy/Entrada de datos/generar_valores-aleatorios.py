#Para poder generar valore aleatorios, importamos la libreria random import random
import random
#otra forma de importar de forma directa esta libreria 
# from(de) random(libreria) import(tomar traer) randint(numeros enteros entre un numero y otro) 
from random import randint

almacen_numero = randint(1, 100)
print(f"Numeros aleatorios entre 1 y 100: {almacen_numero}")

#Simular el tiro de un dado 
respuesta_dado = randint(1, 6)
print(f"El resultado del dado es: {respuesta_dado}")
