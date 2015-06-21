var models = require('../models/models.js');

exports.load= function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }else{
        next(new Error('No existe el quizID =' + quizId));
      }
    }
  ).catch(function(error){next(error);});
}

exports.index = function(req, res){
  var search="";
      if(req.query.search && req.query.search.trim().length>0){
      	search=req.query.search.replace(/\s/g,"%");
        search='%'+search+'%';
      }

    models.Quiz.findAll({where: ["pregunta like ?", search],order:"pregunta"}).then(function(quizes){
      res.render('quizes/index', {quizes: quizes, search: search});
    }).catch(function(error){next(error);});
};

exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res){
   var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta){
      resultado = 'Correcto';
    }
      res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});

};
