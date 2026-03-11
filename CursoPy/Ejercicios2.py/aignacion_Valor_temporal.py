#Esto es asignacion multiple, podemos alamacenar multiples valores
#  o cadenas, en distintas variables al mismo tiempo 
x, y, z = 5, "hola", -10.2
print(f"valor de x= {x}, y={y}, z={z}")

#Asignacion multiple
a = b = c= 10
print(F"{a},{b},{c}")#10,10,10

#Intercambio de valores de una variable
x,y = 5, 10

print(f"Valor original X={x}, y={y}")
#invertimos el valor de las variables, 


print(f"Valores cambiados x={x}, y={y}")

#Aplicando el metodo de asignacion multiple, sin usar variables temporales
x, y = 5, 10
print(f"Valor original X={x}, y={y}")

x , y = y, x
print(f"Valores cambiados x={x}, y={y}")

nombre, apellido = input("ingresa tu nombre y apellido separado por (,): ").split(",")
#La funcion .split(","), le agregamos el parametro ",", para que sea el caracter que separe el ingreso
#y se almacene los 2 valores en varibales separadas.
print(f"El autor del libro {nombre}{apellido}")