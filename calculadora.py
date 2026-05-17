def main():
    print('='*10,'CALCULADORA','='*10)
    print('\nOperadores: +, -, *, /.')
    n1 = float(input('\nPrimeiro número: '))
    n2 = float(input('Segundo número '))
    op = input('Escolha um operador: ')
    
    if op == '+':
        resultado = n1 + n2
        
    elif op == '-':
        resultado = n1 - n2
        
    elif op == '*':
        resultado = n1 * n2
        
    elif op == '/':
        resultado = n1 / n2
        
    print(f'\n{resultado}')
    
    
    
main()  