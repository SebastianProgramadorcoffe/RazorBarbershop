#Aritmeticos

numero1 =18

numero2 = 12

suma = numero1 + numero2

resta = numero1 - numero2

division = numero1 / numero2

multiplicacion = numero1  * numero2

modulo =numero1 % numero2

divisionEntera =numero1 // numero2

print("La suma es: ",suma)

print("La resta es: ",resta)

print("La division es: ",division)

print("La multiplicación es: ",multiplicacion)

print("El modulo es: ", modulo)

print("La division entera es: ", divisionEntera)
#Asignacion

var1 = 5

var2 = 12

var3 = 8

var4 = 14

var5 =6

var6= 8

var1 += 3 #var1 = var1+3 Asignación con suma

var2 -=3 #var2 = var2-3 Asignación con resta

var3 *= 3 #var3 = var3*3 Asignación con multiplicación

var4 /= 3 #var4 = var4/3 Asignación con división

var5 %= 3 #var5 = var5%3 Asignación con residuo

cd = var6 // 3 #var6 var6%3 Asignación con división entera

print(var1)
print(var2)
print(var3)
print(var5)
print(var4)
print(cd)


m = 45
n = 23
print(m == n) #Igualdad

print(m > n) #Mayor que >

print(m < n) #Menor que <

print(m >= n) #Mayor igual que >=

print(m <= n) #Menor igual que <=

print(m != n) #No igual !

#and (y)
q = 5
print( q > 4 and q < 9 )
#or (o)
print(q > 5 or q < 10 )
#not (0)
print(not( q > 2 and q< 7)) # returns False because not is used to reverse the result
#Expresion 42//6+7*3-39

resultado0 = 42//6+7*3-39
print (resultado0)
resultado1 = (42//6)+7*3-39 #// Prioridad 3
print (resultado1)
resultado2 = (42//6)+(7*3)-39 #* Prioridad 3
print (resultado2)
resultado3 = ((42//6)+(7*3))-39 #+ Prioridad 4
print (resultado3)
resultado4 = (((42//6)+(7*3))-39) #- Prioridad 4
print (resultado4)