from random import randint
print("***Sistema generador de Id Unico***")
#ingreso de los datos principales primer y segundo nombre mas añode nacimiento
primer_nombre = input('Ingrese Primer Nombre: ')
segundo_nombre = input('Ingrese Segundo Nombre: ')
ano_nacimiento = input('Ingrese su año de nacimiento(yyyy): ')
#alamacenamos y pasamos los 2 primeros caracteres de 
# prnm y sgnm a mayusculas al igual que tomar 2 letras del año de nacimiento
#.strip() para quitar espacios al inicio y al final
dos_primern = primer_nombre.strip().upper()[0:2]
dos_segundon = segundo_nombre.strip().upper()[0:2]
dos_anonaci = ano_nacimiento.strip()[2:4]
numeros_aleatorios = randint(1001, 9999)
#realizamos la concatenacion de los datos
numero_de_placa = f"{dos_primern}{dos_segundon}{dos_anonaci}{numeros_aleatorios}"

print("***Numero de placa del vehiculo***")
print("_______________________________________")
print(f"Hola {primer_nombre},")
print(f"    Tu numero de (Placa)) es: {numero_de_placa}\nFelicidades!")