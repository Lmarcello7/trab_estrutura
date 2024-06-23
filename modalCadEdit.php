<?php sleep(1); ?>

<form id="formCadEdit">
    <div class="row">
        <div class="col-2">
            <label for="cod">Código</label>
            <input type="text" name="cod" id="cod" class="form-control form-control-sm" disabled>
        </div>
        <div class="col-8">
            <label for="prod">Produto</label>
            <input type="text" name="prod" id="prod" class="form-control form-control-sm" required>
        </div>
        <div class="col-2">
            <label for="qtd">Qtd. Disp.</label>
            <input type="number" name="qtd" id="qtd" class="form-control form-control-sm" required>
        </div>
    </div>
</form>

<script>
    var rec = '<?= isset($_REQUEST['rec']) ? json_encode($_REQUEST['rec']) : '' ?>';
    $(document).ready(function() {
        if (rec != '') {
            $.ajax({
                url: '../trab/api/api.php',
                type: 'POST',
                data: {
                    function: 'getItensProd',
                    arrData: rec
                },
                dataType: 'json',
                success: function(data) {
                    $('#cod').val(data.cod);
                    $('#prod').val(data.prod);
                    $('#qtd').val(data.qtd);
                }
            });
        } else {
            $.ajax({
                url: '../trab/api/api.php',
                type: 'POST',
                data: {
                    function: 'getCodProd'
                },
                dataType: 'json',
                success: function(data) {
                    $('#cod').val(data);
                }
            });
        }
    });
</script>