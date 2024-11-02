<!--Meter esta carpeta en xampp, no sirve que esté en FukusukeSushi-->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Integración Ejemplo</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <!--Inicializar el body-->
    <script>
        
    </script>

    <!--Meter elementos a un array con forEach-->
    <script>
        function meter(respuesta, array) {
            for (let i = 0; i < respuesta.length; i++) {
                array.push('<option value="' + respuesta[i].id + '">' + respuesta[i].nombre + '</option>');
            }
        }

    </script>

    <!--Cambiar la descripción-->
    <script>
        function cambiarDescripcion(){
            let comboCategoria = document.getElementById("categoria");
            let indice = comboCategoria.selectedIndex;
            let idCategoria = comboCategoria[indice].value;
            let query = `
            query GetCategoriaById($getCategoriaByIdId: ID!) {
                getCategoriaById(id: $getCategoriaByIdId) {
                    descripcion
                }
            }
            `;
            $.ajax({
                type: "POST",
				url: "http://localhost:8091/graphql",
				contentType: "application/json",
				timeout: 15000,
                data: JSON.stringify({
					query: query,
					variables: {
						getCategoriaByIdId: idCategoria
					}
				}),
				success: function(response){
                    descripcion = response.data.getCategoriaById.descripcion;
                    document.getElementById("coso").innerHTML = descripcion;
				}
            })
        }
    </script>

    <!--
    <script>
		function addPersona(){
			let nom = document.getElementById('nombre').value;
			let mutation = `
			mutation miMutation($input: PersonaInput) {
				addPersona(input: $input){
					id
					nombre
				}
			}
			`;
			$.ajax({
				type: "POST",
				url: "http://localhost:8091/graphql",
				contentType: "application/json",
				timeout: 15000,
				data: JSON.stringify({
					query: mutation,
					variables: {
						input: {
							nombre: nom
						}
					}
				}),
				success: function(response){
					alert(response.data.addPersona.id)
				}
			})
		}
	</script>
    -->
</head>
<body>
<div class="container mt-3">
<h2>Descripción de Categorías</h2>
    <form>
        <label for="categoria" class="form-label">Categoría</label>
        <select class="form-select" id="categoria" name="categoria" onchange="cambiarDescripcion();">
        </select>
        <br>

        <table class="table">
            <thead>
                <tr>
                    <th>Descripción</th>
                </tr>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td id="coso">Elige una categoría</td>
                </tr>
                <tr></tr>
            </tbody>
        </table>
    </form>
</div>
</body>
</html>
<script>inicial();</script>
