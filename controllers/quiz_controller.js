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
  ).catch (function(error){next(error);});
}

exports.index = function(req, res){

  var search="";
      if(req.query.search && req.query.search.trim().length>0){
      	search=req.query.search.replace(/\s/g,"%");
        search='%'+search+'%';
      }
      if(search === ''){
        models.Quiz.findAll().then(function(quizes){
          res.render('quizes/index', {quizes: quizes,
                                      search: search,
                                      errors: []
                                      });
        }).catch(function(error){next(error);});
      }
      else{
        models.Quiz.findAll({where: ["pregunta like ?", search], order:"pregunta"}).then(function(quizes){
          res.render('quizes/index', {quizes: quizes,
                                      search: search,
                                      errors: []
                                      });
        }).catch(function(error){next(error);});
      }



};

exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res){
   var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta){
      resultado = 'Correcto';
    }
      res.render('quizes/answer', { quiz: req.quiz,
                                    respuesta: resultado,
                                    errors: []
                                  });
};

exports.new = function(req, res){
  var quiz = models.Quiz.build({ pregunta:"pregunta", respuesta:"respuesta", tema: "tema"});
  res.render('quizes/new', {quiz:quiz , errors: []});
};

exports.create = function(req, res){
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')})
      }
    }
  ).catch(function(error){next(error);});
};

exports.edit = function(req, res){
    var quiz = req.quiz;
    res.render('quizes/edit', {quiz:quiz, errors: []});
};

exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz , errors: err.errors });
      }else{
        req.quiz
        .save({fields:["pregunta", "respuesta", "tema"]})
        .then(function(){
          res.redirect('/quizes');
        })
      }
    }
  ).catch(function(error){next(error);});
};

exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error);});
};
