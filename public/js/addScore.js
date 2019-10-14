$('document').ready(function () {
  $('.select-selectize').selectize({
    delimiter: ',',
    persist: false,
    create: function (input) {
      return {
        value: input,
        text: input
      }
    }
  })
  $('.select-selectize-single').selectize({
    sortField: 'text'
  })
})
window.onload = function () {
  $('#eventSelector').change(function () {
    const eventId = $(this).val()
    $.ajax({
      url: 'getPoints',
      type: 'GET',
      datatype: 'JSON',
      data: { data: eventId },
      success: function (res) {
        for (let i = 0; i < res.length; i++) {
          if (res.length === 3) {
            const id = 'points' + (i + 1)
            const input = document.getElementById(id)
            input.value = res[i]
          }
        }
      }
    })
  })

  var ct = 3
  const addButton = document.getElementById('addPositionBlock')
  addButton.addEventListener('click', addPositionBlock)

  function addPositionBlock () {
    $.ajax(
      {
        url: 'api/hostels',
        type: 'GET',
        success: function (result) {
          ct++

          const position = 'position' + ct
          const wrapper = document.getElementById('p-div')

          const div = document.createElement('div')
          div.classList.add('border-class')
          div.setAttribute('id', 'div' + ct)
          const deleteButton = document.createElement('button')
          deleteButton.innerHTML = 'Close ❌ '
          deleteButton.classList.add('delete')
          deleteButton.addEventListener('click', function () {
            const elem = document.getElementById('div' + ct)
            elem.parentNode.removeChild(elem)
            ct = ct - 1
          })
          div.appendChild(deleteButton)

          const positionHead = document.createElement('h1')
          positionHead.innerHTML = 'Position ' + ct + ':'
          div.appendChild(positionHead)

          const container = document.createElement('div')
          container.classList.add('container')
          container.classList.add('row')

          const hostelDiv = document.createElement('div')
          hostelDiv.classList.add('col-6')
          hostelDiv.classList.add('col-12-small')
          const hostelLabel = document.createElement('Label')
          hostelLabel.setAttribute('for', position)
          hostelLabel.innerHTML = 'Hostel :'
          hostelDiv.appendChild(hostelLabel)

          const selectHostel = document.createElement('select')
          selectHostel.setAttribute('name', ('position' + ct))
          selectHostel.setAttribute('multiple', 'multiple')
          selectHostel.classList.add('select-selectize')

          for (let i = 0; i < result.length; i++) {
            const hostel = document.createElement('option')
            hostel.value = result[i]._id
            hostel.textContent = result[i].name
            selectHostel.appendChild(hostel)
          }
          hostelDiv.appendChild(selectHostel)
          container.appendChild(hostelDiv)

          const pointsDiv = document.createElement('div')
          pointsDiv.classList.add('col-6')
          pointsDiv.classList.add('col-12-small')
          const pointsLabel = document.createElement('Label')
          var points = 'points' + ct
          pointsLabel.setAttribute('for', points)
          pointsLabel.innerHTML = 'Points :'
          pointsDiv.appendChild(pointsLabel)

          const input = document.createElement('input')
          input.type = 'number'
          input.name = points
          input.id = points
          input.defaultValue = 0
          input.min = 0
          pointsDiv.appendChild(input)

          container.appendChild(pointsDiv)
          div.appendChild(container)
          wrapper.appendChild(div)
          $(document).ready(function () {
            $(selectHostel).selectize({
              delimiter: ',',
              persist: false,
              create: function (input) {
                return {
                  value: input,
                  text: input
                }
              }
            })
          })
        }
      }
    )
  }
}
