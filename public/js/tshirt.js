$('.requirementSelector').on('change', (e) => {
  if ($('#requirement-both').prop('checked') === true) {
    $('#tshirt-selector').removeClass('hidden')
    $('#size').prop({ required: true })
  } else {
    $('#tshirt-selector').addClass('hidden')
    $('#size').prop({ required: false })
  }
})

$('.stypeSelector').on('change', (e) => {
  console.log($('#stype-hostel').prop('checked'))
  if ($('#stype-hostel').prop('checked') === true) {
    $('#hostel').html(
      '<option value="">Please select</option><option value="Agate">Agate</option><option value="Azurite">Azurite</option><option value="Bloodstone">Bloodstone</option><option value="Cobalt">Cobalt</option><option value="Opal">Opal</option>'
    )
    $('.requirementSelector').removeClass('hidden')
    $('#ds-info').addClass('hidden')
    if ($('#requirement-both').prop('checked') === false) {
      $('#tshirt-selector').addClass('hidden')
    }
  } else {
    $('#hostel').html(
      '<option value="">Please select</option><option value="Cobalt">Cobalt</option><option value="Opal">Opal</option>'
    )
    $('.requirementSelector').addClass('hidden')
    $('#ds-info').removeClass('hidden')
    $('#tshirt-selector').removeClass('hidden')
  }
  $('#hostelSelector').removeClass('hidden')
})
