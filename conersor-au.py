''' Faça um programa que recebe uma distância em unidades astrônomicas (au) e 
  converta em uma função separada, então chame o resultado da conversão na main. '''

def convert(au):
    calculo = au * 149597870700
    
    return calculo
    
    
def main():
    while True:    
        au = input('Distãncia em AU: ')
        
        try:
            au = float(au)
            break
        
        except ValueError:
            continue
        
    print(f'{au} AU é {convert(au):,.0f} metros')
        
    
if __name__ == '__main__':
    main()