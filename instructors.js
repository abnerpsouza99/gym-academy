const fs = require('fs')
const data = require('./data.json')
const Intl = require('intl')
// Desestruturando objeto do utils.js, pegando o atributo age
const { age, date } = require('./utils')

// Show
exports.show = function(req, res) {
    // req.params.id = /:id
    // Desestruturando req.params
    // req.params para buscar dados pela URL
    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return id == instructor.id
    })

    if(!foundInstructor){
        return res.send('Instructor not found!')
    }
    
    const instructor = {
        // Spread Operator: Serve para trazer tudo de foundInstructor
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","), // Split serve para transformar uma String em Array | Insere o item a cada vírgula
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at) // Salva a data atual
    }    

    return res.render("instructors/show", {instructor})
}

// Create
exports.post = function(req, res){
    
    // Cria um Array com as chaves do objeto
    const keys = Object.keys(req.body)

    // Validação de envio dos dados antes de os enviar ao Banco de Dados
    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Please, fill the fields!')
        }
    }

    // Desestruturar objeto
    let {avatar_url, birth, name, services, gender, id} = req.body


    birth = Date.parse(birth)
    const created_at = new Intl.DateTimeFormat('pt-BR').format(Date.now)
    // Incremento do id
    id = Number(data.instructors.length + 1)

    
    // Adiciona o req.body no Array em data.json
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err){
            return res.send("Write file error!")
        }
        return res.redirect("/instructors")
    })
}

// Edit

exports.edit = function(req, res) {
    const {id} = req.params
    const foundInstructor = data.instructors.find(function(instructor){
        return id == instructor.id
    })

    if(!foundInstructor){
        return res.send('Instructor not found!')
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit', {instructor: instructor})
}

// Put

exports.put = function(req, res){
    // req.body para buscar dados do Formulário
    const {id} = req.body

    let index = 0
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if(id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor){
        return res.send('Instructor not found!')
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })

}

// Delete

exports.delete = function(req, res){
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect('/instructors')
    })
}


