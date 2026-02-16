#Para la entrada de datos utilizamos input(),
#  creando una variable de almacenamiento posterior
#  a esto el mensaje que vera el usuario
# 
entrada_1 = input("Nombre de Usuario: ")
print(entrada_1) 
#Cuando ingresamos datos, 
# los datos se alamacenan como string, para pasar a otro tipo de datos de
# cadena a int se agrega 
# la entrada dento del los parametros de int() = int(input("Ingrese su Nombre: "))
almacen_entrada = int(input("Ingrese su edad: "))

print(f"Tu edad es: {almacen_entrada}")

