# creacion de cadenas
Nombre = "Sebastian Beltran Ojeda"
Empresa = " Global Mentori "
Dominio = ".com.mx"
Arroba = "@"

Nombre_sin_espacios = Nombre.strip()#Quita los espacios al inicio y al final 
Nombre_sin_espacios = Nombre_sin_espacios.replace(' ', '.')
nombre_minusculas = Nombre_sin_espacios.lower()
#Empresa
Nombre_empresa_sin_espacios = Empresa.replace(' ', '')
nombre_empresa_minuscula = Nombre_empresa_sin_espacios.lower()

#Concatenacion de resultados
Correo_Email = f"{nombre_minusculas}{Arroba}{nombre_empresa_minuscula}{Dominio}"
print("El correo generado es: ", Correo_Email)
