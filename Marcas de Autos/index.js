 // Definir colores para cada marca
        const coloresPorMarca = {
            'Toyota': '#F5276C',       
            'Honda': '#F54927',         
            'Ford': '#F5B027',          
            'Chevrolet': '#6EE23C',     
            'Nissan': '#3CE25D',        
            'BMW': '#3CE2B0',           
            'Audi': '#4652D8',          
            'Mercedes-Benz': '#4652D8', 
            'Hyundai': '#8346D8',       
            'Kia': '#BB162B'            
        };

        const selectMarca = document.getElementById('selectMarca');
        const selectModelo = document.getElementById('selectModelo');

        // Cargar marcas al iniciar la página
        async function cargarMarcas() {
            try {
                const response = await fetch('http://localhost:8888/marcas');
                const data = await response.text();
                const marcas = data.split('\n').filter(marca => marca.trim() !== '');

                marcas.forEach(marca => {
                    const option = document.createElement('option');
                    option.value = marca.trim();
                    option.textContent = marca.trim();
                    selectMarca.appendChild(option);
                });
            } catch (error) {
                console.error('Error al cargar las marcas:', error);
                alert('Error al cargar las marcas. Asegúrese de que el servidor esté ejecutándose.');
            }
        }

        // Cargar modelos cuando se selecciona una marca
        async function cargarModelos(marca) {
            try {
                const response = await fetch(`http://localhost:8888/modelos/${marca}`);
                const data = await response.text();
                const modelos = data.split('\n').filter(modelo => modelo.trim() !== '');

                // Limpiar select de modelos
                selectModelo.innerHTML = '<option value="">-- Seleccione un modelo --</option>';

                modelos.forEach(modeloCompleto => {
                    const option = document.createElement('option');
                    // Extraer solo el nombre del modelo (después del guión)
                    const modelo = modeloCompleto.split(' - ')[1] || modeloCompleto;
                    option.value = modeloCompleto.trim();
                    option.textContent = modelo.trim();
                    selectModelo.appendChild(option);
                });

                // Habilitar el select de modelos
                selectModelo.disabled = false;

                // Cambiar el color del select de modelos según la marca
                cambiarColorSelect(selectModelo, marca);

            } catch (error) {
                console.error('Error al cargar los modelos:', error);
                alert('Error al cargar los modelos.');
            }
        }

        // Cambiar color del select según la marca
        function cambiarColorSelect(selectElement, marca) {
            const color = coloresPorMarca[marca] || '#4CAF50';
            selectElement.style.borderColor = color;
            selectElement.style.color = color;
            selectElement.style.fontWeight = 'bold';
        }

        // Evento cuando se selecciona una marca
        selectMarca.addEventListener('change', function() {
            const marcaSeleccionada = this.value;

            if (marcaSeleccionada) {
                // Cambiar color del select de marcas
                cambiarColorSelect(this, marcaSeleccionada);
                // Cargar modelos de la marca seleccionada
                cargarModelos(marcaSeleccionada);
            } else {
                // Resetear estilos si no hay marca seleccionada
                this.style.borderColor = '#ddd';
                this.style.color = 'black';
                this.style.fontWeight = 'normal';

                // Deshabilitar y limpiar select de modelos
                selectModelo.disabled = true;
                selectModelo.innerHTML = '<option value="">-- Primero seleccione una marca --</option>';
                selectModelo.style.borderColor = '#ddd';
                selectModelo.style.color = 'black';
                selectModelo.style.fontWeight = 'normal';
            }
        });

        // Cargar marcas al iniciar
        cargarMarcas();