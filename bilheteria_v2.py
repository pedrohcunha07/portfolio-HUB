filmes = {
    'Avatar': {'preço': 40.00, 'idade': 12}, 
    'Batman': {'preço': 45.00, 'idade': 16},
    'Homem-Aranha': {'preço': 40.00, 'idade': 12}, 
    'Scary Movie': {'preço': 45.00, 'idade': 16},
    '2DIE4': {'preço': 45.00, 'idade': 16},
    'Super Mario Bros': {'preço': 40.00, 'idade': 6}
    
}

def busca_filme():  
    total = 0
    while True:    
        try:
            escolha_filme = input('Escolha um filme: ').title().strip()
            if escolha_filme == 'Finalizar':
                break
            
            if escolha_filme not in filmes:
                raise KeyError
            
            escolha_idade = int(input('Qual a sua idade? '))
            if escolha_idade < filmes[escolha_filme]['idade']:
                print('Idade insuficiente. Escolha outro filme')
                continue
            
            quant_ingressos = int(input('Quantos ingressos? '))
            total += quant_ingressos * filmes[escolha_filme]['preço']
            

        
        except KeyError:
            print('Filme não se encontra no catálogo. Tente de novo')            
            continue
        
        except ValueError:
            print('Digite um valor válido!')
            continue
    
    return total
            
    

def main():
    print('Digite "Finalizar" para encerrar a compra')
    print('='*12, 'FILMES', '='*12)
    for filme, info in filmes.items():
        idade = info['idade']
        preco = info['preço']
        print(f'{filme}( {idade} anos): R${preco:.2f}')
    print('='*32)
    
    resultado = busca_filme()
    print(f'Total: {resultado:.2f}')
    
    
main()