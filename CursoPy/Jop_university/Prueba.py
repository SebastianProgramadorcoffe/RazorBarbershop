#funcion .split() quita espacios al inicio y final 
correo_save = "estudiante1@estudiantefup.edu.co "
print(correo_save.strip()) 
print("\n")

entrada2 = "Python,java,SQL,c++,javaScript"
print(entrada2.split(","))
print("\n")

ingreso_Text = input("Ingrese nombre del proyecto: ")
numeroEvaluacion = input("Ingrese el numero de reviciones: ")

print(f"""DATOS DEL PROYECTO:
___________________________
Nombre: {ingreso_Text.upper()}
Reviciones: {numeroEvaluacion} en total.""")

entradaLuis = "luis102983"
print(f"Prefijo del usuario: {entradaLuis[:4]}")
