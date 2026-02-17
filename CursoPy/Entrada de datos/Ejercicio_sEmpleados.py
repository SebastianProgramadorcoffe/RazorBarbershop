print("***Sistema de Diligenciamiento de Datos***")
almacen_nombre = input("Ingrese su nombre completo: ")
alamacen_Edad = int(input("Ingrese su edad: "))
salario = float(input("Salario aproximado: "))
boolean_jefe = input("Es jefe de departamento. si/no?: ")
#Para que los valores bool funcionen, devemos especificar 
# con una comparacion, lo que entra si es igual al si = True
#de lo contrario es False
boolean_jefe = boolean_jefe.lower() == "si"
print("***Datos Diligenciados***")
print()
print("Nombre:")
print(f"Nombre: {almacen_nombre}")
print(f"Edad: {alamacen_Edad}")
print(f"Salario recibido: {salario}")
print(f"Es jefe: {boolean_jefe}")
print()