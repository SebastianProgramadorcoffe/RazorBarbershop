# crear un sistema donde alamacene informacion de un usuario, nombre, empresa, dominio de red


nombre_usuario = "Sebastian Beltran Ojeda"
nombre_empresa = "Vidrio Lumi"
dominio = ".edu.co"

nombre_limpio = nombre_usuario.replace(' ', '.')
nombre_minuscula = nombre_limpio.lower()
empresa_limpio = nombre_empresa.replace(' ', '')
nombreE_minusculas = empresa_limpio.lower()
empresa_limpio = "remplazo"
#Concatenamos terminos o resultados
correo_empresa = f"{nombre_minuscula}@{nombreE_minusculas}{dominio}"
print(correo_empresa)
