import random
import sys
import time

sys.setrecursionlimit(20000000)

cantidad = 10_000_000
lista = [random.randint(0, 1000000) for _ in range(cantidad)]


print("Primeros 100 números generados:")
print(lista[:100])

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivote = arr[len(arr) // 2]
    
    menores = [x for x in arr if x < pivote]
    iguales = [x for x in arr if x == pivote]
    mayores = [x for x in arr if x > pivote]
    
    return quicksort(menores) + iguales + quicksort(mayores)

 
print("Ordenando...")
inicio = time.perf_counter()  

lista_ordenada = quicksort(lista[:100])

fin = time.perf_counter() 

print("Primeros 100 números ordenados:")
print(lista_ordenada[:100])

print(f"\nTiempo de ejecución: {fin - inicio:.4f} segundos")


