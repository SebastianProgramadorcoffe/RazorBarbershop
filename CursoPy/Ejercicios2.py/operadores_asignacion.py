# El = es un operador de asignacion, podemos realizar una asignacion multiplea así:
numero1, texto, float1 = 12, 'sebastian', 12.5 

# Intercambio de valores de una variable 
x, y = 3, 4
#Intercambio
x, y = y, x 
#Cuando queremos ingresar el nombre y apellido de un 
# usuario pero que sean almacenados en 2 variables pero agregando 
# la funsion .slipt() para separar las variables 
nombre2, nombre3 = input("ingrese su nombre y apellido: ").split()
print(f"su nombre y apellido son {nombre2.strip()}{nombre3.strip()}")
