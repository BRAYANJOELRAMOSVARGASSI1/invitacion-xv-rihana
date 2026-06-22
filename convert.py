import os
import subprocess
import sys

def install_pillow():
    try:
        import PIL
    except ImportError:
        print("Pillow no está instalado. Instalando...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])

install_pillow()

from PIL import Image

def convert_to_webp(filename):
    if not os.path.exists(filename):
        print(f"Archivo {filename} no encontrado.")
        return
        
    img = Image.open(filename)
    # Crea el nuevo nombre de archivo con extensión .webp
    webp_filename = filename.rsplit('.', 1)[0] + '.webp'
    
    # Guarda la imagen con compresión y calidad 80
    img.save(webp_filename, 'webp', quality=80)
    
    orig_size = os.path.getsize(filename) / 1024
    new_size = os.path.getsize(webp_filename) / 1024
    print(f"Convertido: {filename} ({orig_size:.2f} KB) -> {webp_filename} ({new_size:.2f} KB)")

if __name__ == "__main__":
    # Lista de imágenes a convertir (puedes agregar más si lo necesitas)
    images = ['fondo_floral.png', 'iconos.png', 'mariposa.png', 'quinceanera.png']
    
    print("Iniciando optimización de imágenes a WebP...")
    for img in images:
        convert_to_webp(img)
    print("¡Optimización finalizada!")
