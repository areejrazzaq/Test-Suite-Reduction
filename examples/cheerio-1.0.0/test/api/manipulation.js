var expect = require('expect.js'),
    cheerio = require('../..'),
    fruits = require('../fixtures').fruits,
    toArray = Function.call.bind(Array.prototype.slice);

describe('$(...)', function () {
  var $, $fruits;

  beforeEach(function () {
    $ = cheerio.load(fruits);
    $fruits = $('#fruits');
  });

  describe('.wrap', function () {
it('-155-(Cheerio object) : should insert the element and add selected element(s) as its child', function () {
      var $redFruits = $('<div class="red-fruits"></div>');
      $('.apple').wrap($redFruits);

      expect($fruits.children().eq(0).hasClass('red-fruits')).to.be.ok();
      expect($('.red-fruits').children().eq(0).hasClass('apple')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('orange')).to.be.ok();
      expect($redFruits.children()).to.have.length(1);
    });

it('-156-(element) : should wrap the base element correctly', function () {
      $('ul').wrap('<a></a>');
      expect($('body').children()[0].tagName).to.equal('a');
    });

it('-157-(element) : should insert the element and add selected element(s) as its child', function () {
      var $redFruits = $('<div class="red-fruits"></div>');
      $('.apple').wrap($redFruits[0]);

      expect($fruits.children()[0]).to.be($redFruits[0]);
      expect($redFruits.children()).to.have.length(1);
      expect($redFruits.children()[0]).to.be($('.apple')[0]);
      expect($fruits.children()[1]).to.be($('.orange')[0]);
    });

it('-158-(html) : should insert the markup and add selected element(s) as its child', function () {
      $('.apple').wrap('<div class="red-fruits"> </div>');
      expect($fruits.children().eq(0).hasClass('red-fruits')).to.be.ok();
      expect($('.red-fruits').children().eq(0).hasClass('apple')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('orange')).to.be.ok();
      expect($('.red-fruits').children()).to.have.length(1);
    });

it('-159-(html) : discards extraneous markup', function () {
      $('.apple').wrap('<div></div><p></p>');
      expect($('div')).to.have.length(1);
      expect($('p')).to.have.length(0);
    });

it('-160-(html) : wraps with nested elements', function () {
      var $orangeFruits = $(
        '<div class="orange-fruits"><div class="and-stuff"></div></div>'
      );
      $('.orange').wrap($orangeFruits);

      expect($fruits.children().eq(1).hasClass('orange-fruits')).to.be.ok();
      expect(
        $('.orange-fruits').children().eq(0).hasClass('and-stuff')
      ).to.be.ok();
      expect($fruits.children().eq(2).hasClass('pear')).to.be.ok();
      expect($('.orange-fruits').children()).to.have.length(1);
    });

it('-161-(html) : should only worry about the first tag children', function () {
      var delicious = '<span> This guy is delicious: <b></b></span>';
      $('.apple').wrap(delicious);
      expect($('b>.apple')).to.have.length(1);
    });

it('-162-(selector) : wraps the content with a copy of the first matched element', function () {
      var $oranges;

      $('.apple').wrap('.orange, .pear');

      $oranges = $('.orange');
      expect($('.pear')).to.have.length(1);
      expect($oranges).to.have.length(2);
      expect($oranges.eq(0).parent()[0]).to.be($fruits[0]);
      expect($oranges.eq(0).children()).to.have.length(1);
      expect($oranges.eq(0).children()[0]).to.be($('.apple')[0]);
      expect($('.apple').parent()[0]).to.be($oranges[0]);
      expect($oranges.eq(1).children()).to.have.length(0);
    });

it('-163-(fn) : should invoke the provided function with the correct arguments and context', function () {
      var $children = $fruits.children();
      var args = [];
      var thisValues = [];

      $children.wrap(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([[0], [1], [2]]);
      expect(thisValues).to.eql([$children[0], $children[1], $children[2]]);
    });

it('-164-(fn) : should use the returned HTML to wrap each element', function () {
      var $children = $fruits.children();
      var tagNames = ['div', 'span', 'p'];

      $children.wrap(function () {
        return '<' + tagNames.shift() + '>';
      });

      expect($fruits.find('div')).to.have.length(1);
      expect($fruits.find('div')[0]).to.be($fruits.children()[0]);
      expect($fruits.find('.apple')).to.have.length(1);
      expect($fruits.find('.apple').parent()[0]).to.be($fruits.find('div')[0]);

      expect($fruits.find('span')).to.have.length(1);
      expect($fruits.find('span')[0]).to.be($fruits.children()[1]);
      expect($fruits.find('.orange')).to.have.length(1);
      expect($fruits.find('.orange').parent()[0]).to.be(
        $fruits.find('span')[0]
      );

      expect($fruits.find('p')).to.have.length(1);
      expect($fruits.find('p')[0]).to.be($fruits.children()[2]);
      expect($fruits.find('.pear')).to.have.length(1);
      expect($fruits.find('.pear').parent()[0]).to.be($fruits.find('p')[0]);
    });

it('-165-(fn) : should use the returned Cheerio object to wrap each element', function () {
      var $children = $fruits.children();
      var tagNames = ['span', 'p', 'div'];

      $children.wrap(function () {
        return $('<' + tagNames.shift() + '>');
      });

      expect($fruits.find('span')).to.have.length(1);
      expect($fruits.find('span')[0]).to.be($fruits.children()[0]);
      expect($fruits.find('.apple')).to.have.length(1);
      expect($fruits.find('.apple').parent()[0]).to.be($fruits.find('span')[0]);

      expect($fruits.find('p')).to.have.length(1);
      expect($fruits.find('p')[0]).to.be($fruits.children()[1]);
      expect($fruits.find('.orange')).to.have.length(1);
      expect($fruits.find('.orange').parent()[0]).to.be($fruits.find('p')[0]);

      expect($fruits.find('div')).to.have.length(1);
      expect($fruits.find('div')[0]).to.be($fruits.children()[2]);
      expect($fruits.find('.pear')).to.have.length(1);
      expect($fruits.find('.pear').parent()[0]).to.be($fruits.find('div')[0]);
    });

it('-166-($(...)) : for each element it should add a wrapper elment and add the selected element as its child', function () {
      var $fruitDecorator = $('<div class="fruit-decorator"></div>');
      $('li').wrap($fruitDecorator);
      expect($fruits.children().eq(0).hasClass('fruit-decorator')).to.be.ok();
      expect(
        $fruits.children().eq(0).children().eq(0).hasClass('apple')
      ).to.be.ok();
      expect($fruits.children().eq(1).hasClass('fruit-decorator')).to.be.ok();
      expect(
        $fruits.children().eq(1).children().eq(0).hasClass('orange')
      ).to.be.ok();
      expect($fruits.children().eq(2).hasClass('fruit-decorator')).to.be.ok();
      expect(
        $fruits.children().eq(2).children().eq(0).hasClass('pear')
      ).to.be.ok();
    });
  });

  describe('.wrapInner', function () {
it('-167-(Cheerio object) : should insert the element and add selected element(s) as its parent', function () {
      var $container = $('<div class="container"></div>');
      $fruits.wrapInner($container);

      expect($fruits.children()[0]).to.be($container[0]);
      expect($container[0].parent).to.be($fruits[0]);
      expect($container[0].children[0]).to.be($('.apple')[0]);
      expect($container[0].children[1]).to.be($('.orange')[0]);
      expect($('.apple')[0].parent).to.be($container[0]);
      expect($fruits.children()).to.have.length(1);
      expect($container.children()).to.have.length(3);
    });

it('-168-(element) : should insert the element and add selected element(s) as its parent', function () {
      var $container = $('<div class="container"></div>');
      $fruits.wrapInner($container[0]);

      expect($fruits.children()[0]).to.be($container[0]);
      expect($container[0].parent).to.be($fruits[0]);
      expect($container[0].children[0]).to.be($('.apple')[0]);
      expect($container[0].children[1]).to.be($('.orange')[0]);
      expect($('.apple')[0].parent).to.be($container[0]);
      expect($fruits.children()).to.have.length(1);
      expect($container.children()).to.have.length(3);
    });

it('-169-(html) : should insert the element and add selected element(s) as its parent', function () {
      $fruits.wrapInner('<div class="container"></div>');

      expect($fruits.children()[0]).to.be($('.container')[0]);
      expect($('.container')[0].parent).to.be($fruits[0]);
      expect($('.container')[0].children[0]).to.be($('.apple')[0]);
      expect($('.container')[0].children[1]).to.be($('.orange')[0]);
      expect($('.apple')[0].parent).to.be($('.container')[0]);
      expect($fruits.children()).to.have.length(1);
      expect($('.container').children()).to.have.length(3);
    });

it("-170-(selector) : should wrap the html of the element with the selector's first match", function () {
      var $oranges;
      $('.apple').wrapInner('.orange, .pear');
      $oranges = $('.orange');
      expect($('.pear')).to.have.length(1);
      expect($oranges).to.have.length(2);
      expect($oranges.eq(0).parent()[0]).to.be($('.apple')[0]);
      expect($oranges.eq(0).text()).to.be('Apple');
      expect($('.apple').eq(0).children()[0]).to.be($oranges[0]);
      expect($oranges.eq(1).parent()[0]).to.be($fruits[0]);
      expect($oranges.eq(1).text()).to.be('Orange');
    });

it('-171-(fn) : should invoke the provided function with the correct arguments and context', function () {
      var $children = $fruits.children();
      var args = [];
      var thisValues = [];

      $children.wrapInner(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([[0], [1], [2]]);
      expect(thisValues).to.eql([$children[0], $children[1], $children[2]]);
    });

it("-172-(fn) : should use the returned HTML to wrap each element's contents", function () {
      var $children = $fruits.children();
      var tagNames = ['div', 'span', 'p'];

      $children.wrapInner(function () {
        return '<' + tagNames.shift() + '>';
      });

      expect($fruits.find('div')).to.have.length(1);
      expect($fruits.find('div')[0]).to.be($('.apple').children()[0]);
      expect($fruits.find('.apple')).to.have.length(1);

      expect($fruits.find('span')).to.have.length(1);
      expect($fruits.find('span')[0]).to.be($('.orange').children()[0]);
      expect($fruits.find('.orange')).to.have.length(1);

      expect($fruits.find('p')).to.have.length(1);
      expect($fruits.find('p')[0]).to.be($('.pear').children()[0]);
      expect($fruits.find('.pear')).to.have.length(1);
    });

it("-173-(fn) : should use the returned Cheerio object to wrap each element's contents", function () {
      var $children = $fruits.children();
      var tags = [$('<div></div>'), $('<span></span>'), $('<p></p>')];

      $children.wrapInner(function () {
        return tags.shift();
      });

      expect($fruits.find('div')).to.have.length(1);
      expect($fruits.find('div')[0]).to.be($('.apple').children()[0]);
      expect($fruits.find('.apple')).to.have.length(1);

      expect($fruits.find('span')).to.have.length(1);
      expect($fruits.find('span')[0]).to.be($('.orange').children()[0]);
      expect($fruits.find('.orange')).to.have.length(1);

      expect($fruits.find('p')).to.have.length(1);
      expect($fruits.find('p')[0]).to.be($('.pear').children()[0]);
      expect($fruits.find('.pear')).to.have.length(1);
    });

it('-174-($(...)) : for each element it should add a wrapper elment and add the selected element as its child', function () {
      var $fruitDecorator = $('<div class="fruit-decorator"></div>');
      var $children = $fruits.children();
      $('li').wrapInner($fruitDecorator);

      expect($('.fruit-decorator')).to.have.length(3);
      expect(
        $children.eq(0).children().eq(0).hasClass('fruit-decorator')
      ).to.be.ok();
      expect($children.eq(0).hasClass('apple')).to.be.ok();
      expect(
        $children.eq(1).children().eq(0).hasClass('fruit-decorator')
      ).to.be.ok();
      expect($children.eq(1).hasClass('orange')).to.be.ok();
      expect(
        $children.eq(2).children().eq(0).hasClass('fruit-decorator')
      ).to.be.ok();
      expect($children.eq(2).hasClass('pear')).to.be.ok();
    });

it('-175-(html) : wraps with nested elements', function () {
      var $badOrangeJoke = $(
        '<div class="orange-you-glad"><div class="i-didnt-say-apple"></div></div>'
      );
      $('.orange').wrapInner($badOrangeJoke);

      expect(
        $('.orange').children().eq(0).hasClass('orange-you-glad')
      ).to.be.ok();
      expect(
        $('.orange-you-glad').children().eq(0).hasClass('i-didnt-say-apple')
      ).to.be.ok();
      expect($fruits.children().eq(2).hasClass('pear')).to.be.ok();
      expect($('.orange-you-glad').children()).to.have.length(1);
    });

it('-176-(html) : should only worry about the first tag children', function () {
      var delicious = '<span> This guy is delicious: <b></b></span>';
      $('.apple').wrapInner(delicious);
      expect($('.apple>span>b')).to.have.length(1);
      expect($('.apple>span>b').text()).to.equal('Apple');
    });
  });

  describe('.append', function () {
it('-177-() : should do nothing', function () {
      expect($('#fruits').append()[0].tagName).to.equal('ul');
    });

it('-178-(html) : should add element as last child', function () {
      $fruits.append('<li class="plum">Plum</li>');
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-179-($(...)) : should add element as last child', function () {
      var $plum = $('<li class="plum">Plum</li>');
      $fruits.append($plum);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-180-(Node) : should add element as last child', function () {
      var plum = $('<li class="plum">Plum</li>')[0];
      $fruits.append(plum);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-181-(existing Node) : should remove node from previous location', function () {
      var apple = $fruits.children()[0];
      var $children;

      expect($fruits.children()).to.have.length(3);
      $fruits.append(apple);
      $children = $fruits.children();

      expect($children).to.have.length(3);
      expect($children[0]).to.not.equal(apple);
      expect($children[2]).to.equal(apple);
    });

it('-182-(existing Node) : should remove existing node from previous location', function () {
      var apple = $fruits.children()[0];
      var $children;
      var $dest = $('<div></div>');

      expect($fruits.children()).to.have.length(3);
      $dest.append(apple);
      $children = $fruits.children();

      expect($children).to.have.length(2);
      expect($children[0]).to.not.equal(apple);

      expect($dest.children()).to.have.length(1);
      expect($dest.children()[0]).to.equal(apple);
    });

it('-183-(existing Node) : should update original direct siblings', function () {
      $('.pear').append($('.orange'));
      expect($('.apple').next()[0]).to.be($('.pear')[0]);
      expect($('.pear').prev()[0]).to.be($('.apple')[0]);
    });

it('-184-(existing Node) : should clone all but the last occurrence', function () {
      var $originalApple = $('.apple');
      var $apples;

      $('.orange, .pear').append($originalApple);

      $apples = $('.apple');
      expect($apples).to.have.length(2);
      expect($apples.eq(0).parent()[0]).to.be($('.orange')[0]);
      expect($apples.eq(1).parent()[0]).to.be($('.pear')[0]);
      expect($apples[1]).to.be($originalApple[0]);
    });

it('-185-(elem) : should NOP if removed', function () {
      var $apple = $('.apple');

      $apple.remove();
      $fruits.append($apple);
      expect($fruits.children().eq(2).hasClass('apple')).to.be.ok();
    });

it('-186-($(...), html) : should add multiple elements as last children', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var grape = '<li class="grape">Grape</li>';
      $fruits.append($plum, grape);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(4).hasClass('grape')).to.be.ok();
    });

it('-187-(Array) : should append all elements in the array', function () {
      var more = $(
        '<li class="plum">Plum</li><li class="grape">Grape</li>'
      ).get();
      $fruits.append(more);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(4).hasClass('grape')).to.be.ok();
    });

it('-188-(fn) : should invoke the callback with the correct arguments and context', function () {
      $fruits = $fruits.children();
      var args = [];
      var thisValues = [];

      $fruits.append(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([
        [0, 'Apple'],
        [1, 'Orange'],
        [2, 'Pear'],
      ]);
      expect(thisValues).to.eql([$fruits[0], $fruits[1], $fruits[2]]);
    });

it('-189-(fn) : should add returned string as last child', function () {
      $fruits = $fruits.children();
      var $apple, $orange, $pear;

      $fruits.append(function () {
        return '<div class="first">';
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.first')[0]).to.equal($apple.contents()[1]);
      expect($orange.find('.first')[0]).to.equal($orange.contents()[1]);
      expect($pear.find('.first')[0]).to.equal($pear.contents()[1]);
    });

it('-190-(fn) : should add returned Cheerio object as last child', function () {
      var $apple, $orange, $pear;
      $fruits = $fruits.children();

      $fruits.append(function () {
        return $('<div class="second">');
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.second')[0]).to.equal($apple.contents()[1]);
      expect($orange.find('.second')[0]).to.equal($orange.contents()[1]);
      expect($pear.find('.second')[0]).to.equal($pear.contents()[1]);
    });

it('-191-(fn) : should add returned Node as last child', function () {
      var $apple, $orange, $pear;
      $fruits = $fruits.children();

      $fruits.append(function () {
        return $('<div class="third">')[0];
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.third')[0]).to.equal($apple.contents()[1]);
      expect($orange.find('.third')[0]).to.equal($orange.contents()[1]);
      expect($pear.find('.third')[0]).to.equal($pear.contents()[1]);
    });

it('-192-should maintain correct object state (Issue: #10)', function () {
      var $obj = $('<div></div>')
        .append('<div><div></div></div>')
        .children()
        .children()
        .parent();
      expect($obj).to.be.ok();
    });

it('-193-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $fruits.append($plum);
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.prepend', function () {
it('-194-() : should do nothing', function () {
      expect($('#fruits').prepend()[0].tagName).to.equal('ul');
    });

it('-195-(html) : should add element as first child', function () {
      $fruits.prepend('<li class="plum">Plum</li>');
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-196-($(...)) : should add element as first child', function () {
      var $plum = $('<li class="plum">Plum</li>');
      $fruits.prepend($plum);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-197-(Node) : should add node as first child', function () {
      var plum = $('<li class="plum">Plum</li>')[0];
      $fruits.prepend(plum);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-198-(existing Node) : should remove existing nodes from previous locations', function () {
      var pear = $fruits.children()[2];
      var $children;

      expect($fruits.children()).to.have.length(3);
      $fruits.prepend(pear);
      $children = $fruits.children();

      expect($children).to.have.length(3);
      expect($children[2]).to.not.equal(pear);
      expect($children[0]).to.equal(pear);
    });

it('-199-(existing Node) : should update original direct siblings', function () {
      $('.pear').prepend($('.orange'));
      expect($('.apple').next()[0]).to.be($('.pear')[0]);
      expect($('.pear').prev()[0]).to.be($('.apple')[0]);
    });

it('-200-(existing Node) : should clone all but the last occurrence', function () {
      var $originalApple = $('.apple');
      var $apples;

      $('.orange, .pear').prepend($originalApple);

      $apples = $('.apple');
      expect($apples).to.have.length(2);
      expect($apples.eq(0).parent()[0]).to.be($('.orange')[0]);
      expect($apples.eq(1).parent()[0]).to.be($('.pear')[0]);
      expect($apples[1]).to.be($originalApple[0]);
    });

it('-201-(elem) : should handle if removed', function () {
      var $apple = $('.apple');

      $apple.remove();
      $fruits.prepend($apple);
      expect($fruits.children().eq(0).hasClass('apple')).to.be.ok();
    });

it('-202-(Array) : should add all elements in the array as inital children', function () {
      var more = $(
        '<li class="plum">Plum</li><li class="grape">Grape</li>'
      ).get();
      $fruits.prepend(more);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('grape')).to.be.ok();
    });

it('-203-(html, $(...), html) : should add multiple elements as first children', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var grape = '<li class="grape">Grape</li>';
      $fruits.prepend($plum, grape);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('grape')).to.be.ok();
    });

it('-204-(fn) : should invoke the callback with the correct arguments and context', function () {
      var args = [];
      var thisValues = [];
      $fruits = $fruits.children();

      $fruits.prepend(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([
        [0, 'Apple'],
        [1, 'Orange'],
        [2, 'Pear'],
      ]);
      expect(thisValues).to.eql([$fruits[0], $fruits[1], $fruits[2]]);
    });

it('-205-(fn) : should add returned string as first child', function () {
      var $apple, $orange, $pear;
      $fruits = $fruits.children();

      $fruits.prepend(function () {
        return '<div class="first">';
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.first')[0]).to.equal($apple.contents()[0]);
      expect($orange.find('.first')[0]).to.equal($orange.contents()[0]);
      expect($pear.find('.first')[0]).to.equal($pear.contents()[0]);
    });

it('-206-(fn) : should add returned Cheerio object as first child', function () {
      var $apple, $orange, $pear;
      $fruits = $fruits.children();

      $fruits.prepend(function () {
        return $('<div class="second">');
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.second')[0]).to.equal($apple.contents()[0]);
      expect($orange.find('.second')[0]).to.equal($orange.contents()[0]);
      expect($pear.find('.second')[0]).to.equal($pear.contents()[0]);
    });

it('-207-(fn) : should add returned Node as first child', function () {
      var $apple, $orange, $pear;
      $fruits = $fruits.children();

      $fruits.prepend(function () {
        return $('<div class="third">')[0];
      });

      $apple = $fruits.eq(0);
      $orange = $fruits.eq(1);
      $pear = $fruits.eq(2);

      expect($apple.find('.third')[0]).to.equal($apple.contents()[0]);
      expect($orange.find('.third')[0]).to.equal($orange.contents()[0]);
      expect($pear.find('.third')[0]).to.equal($pear.contents()[0]);
    });

it('-208-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $fruits.prepend($plum);
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.appendTo', function () {
it('-209-(html) : should add element as last child', function () {
      var $plum = $('<li class="plum">Plum</li>').appendTo(fruits);
      expect($plum.parent().children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-210-($(...)) : should add element as last child', function () {
      $('<li class="plum">Plum</li>').appendTo($fruits);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-211-(Node) : should add element as last child', function () {
      $('<li class="plum">Plum</li>').appendTo($fruits[0]);
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-212-(selector) : should add element as last child', function () {
      $('<li class="plum">Plum</li>').appendTo('#fruits');
      expect($fruits.children().eq(3).hasClass('plum')).to.be.ok();
    });

it('-213-(Array) : should add element as last child of all elements in the array', function () {
      var $multiple = $('<ul><li>Apple</li></ul><ul><li>Orange</li></ul>');
      $('<li class="plum">Plum</li>').appendTo($multiple.get());
      expect($multiple.first().children().eq(1).hasClass('plum')).to.be.ok();
      expect($multiple.last().children().eq(1).hasClass('plum')).to.be.ok();
    });
  });

  describe('.prependTo', function () {
it('-214-(html) : should add element as first child', function () {
      var $plum = $('<li class="plum">Plum</li>').prependTo(fruits);
      expect($plum.parent().children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-215-($(...)) : should add element as first child', function () {
      $('<li class="plum">Plum</li>').prependTo($fruits);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-216-(Node) : should add node as first child', function () {
      $('<li class="plum">Plum</li>').prependTo($fruits[0]);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-217-(selector) : should add element as first child', function () {
      $('<li class="plum">Plum</li>').prependTo('#fruits');
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
    });

it('-218-(Array) : should add element as first child of all elements in the array', function () {
      var $multiple = $('<ul><li>Apple</li></ul><ul><li>Orange</li></ul>');
      $('<li class="plum">Plum</li>').prependTo($multiple.get());
      expect($multiple.first().children().eq(0).hasClass('plum')).to.be.ok();
      expect($multiple.last().children().eq(0).hasClass('plum')).to.be.ok();
    });
  });

  describe('.after', function () {
it('-219-() : should do nothing', function () {
      expect($('#fruits').after()[0].tagName).to.equal('ul');
    });

it('-220-(html) : should add element as next sibling', function () {
      var grape = '<li class="grape">Grape</li>';
      $('.apple').after(grape);
      expect($('.apple').next().hasClass('grape')).to.be.ok();
    });

it('-221-(Array) : should add all elements in the array as next sibling', function () {
      var more = $(
        '<li class="plum">Plum</li><li class="grape">Grape</li>'
      ).get();
      $('.apple').after(more);
      expect($fruits.children().eq(1).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(2).hasClass('grape')).to.be.ok();
    });

it('-222-($(...)) : should add element as next sibling', function () {
      var $plum = $('<li class="plum">Plum</li>');
      $('.apple').after($plum);
      expect($('.apple').next().hasClass('plum')).to.be.ok();
    });

it('-223-(Node) : should add element as next sibling', function () {
      var plum = $('<li class="plum">Plum</li>')[0];
      $('.apple').after(plum);
      expect($('.apple').next().hasClass('plum')).to.be.ok();
    });

it('-224-(existing Node) : should remove existing nodes from previous locations', function () {
      var pear = $fruits.children()[2];
      var $children;

      $('.apple').after(pear);

      $children = $fruits.children();
      expect($children).to.have.length(3);
      expect($children[1]).to.be(pear);
    });

it('-225-(existing Node) : should update original direct siblings', function () {
      $('.pear').after($('.orange'));
      expect($('.apple').next()[0]).to.be($('.pear')[0]);
      expect($('.pear').prev()[0]).to.be($('.apple')[0]);
    });

it('-226-(existing Node) : should clone all but the last occurrence', function () {
      var $originalApple = $('.apple');
      $('.orange, .pear').after($originalApple);

      expect($('.apple')).to.have.length(2);
      expect($('.apple').eq(0).prev()[0]).to.be($('.orange')[0]);
      expect($('.apple').eq(0).next()[0]).to.be($('.pear')[0]);
      expect($('.apple').eq(1).prev()[0]).to.be($('.pear')[0]);
      expect($('.apple').eq(1).next()).to.have.length(0);
      expect($('.apple')[0]).to.not.eql($originalApple[0]);
      expect($('.apple')[1]).to.eql($originalApple[0]);
    });

it('-227-(elem) : should handle if removed', function () {
      var $apple = $('.apple');
      var $plum = $('<li class="plum">Plum</li>');

      $apple.remove();
      $apple.after($plum);
      expect($plum.prev()).to.be.empty();
    });

it('-228-($(...), html) : should add multiple elements as next siblings', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var grape = '<li class="grape">Grape</li>';
      $('.apple').after($plum, grape);
      expect($('.apple').next().hasClass('plum')).to.be.ok();
      expect($('.plum').next().hasClass('grape')).to.be.ok();
    });

it('-229-(fn) : should invoke the callback with the correct arguments and context', function () {
      var args = [];
      var thisValues = [];
      $fruits = $fruits.children();

      $fruits.after(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([
        [0, 'Apple'],
        [1, 'Orange'],
        [2, 'Pear'],
      ]);
      expect(thisValues).to.eql([$fruits[0], $fruits[1], $fruits[2]]);
    });

it('-230-(fn) : should add returned string as next sibling', function () {
      $fruits = $fruits.children();

      $fruits.after(function () {
        return '<li class="first">';
      });

      expect($('.first')[0]).to.equal($('#fruits').contents()[1]);
      expect($('.first')[1]).to.equal($('#fruits').contents()[3]);
      expect($('.first')[2]).to.equal($('#fruits').contents()[5]);
    });

it('-231-(fn) : should add returned Cheerio object as next sibling', function () {
      $fruits = $fruits.children();

      $fruits.after(function () {
        return $('<li class="second">');
      });

      expect($('.second')[0]).to.equal($('#fruits').contents()[1]);
      expect($('.second')[1]).to.equal($('#fruits').contents()[3]);
      expect($('.second')[2]).to.equal($('#fruits').contents()[5]);
    });

it('-232-(fn) : should add returned element as next sibling', function () {
      $fruits = $fruits.children();

      $fruits.after(function () {
        return $('<li class="third">')[0];
      });

      expect($('.third')[0]).to.equal($('#fruits').contents()[1]);
      expect($('.third')[1]).to.equal($('#fruits').contents()[3]);
      expect($('.third')[2]).to.equal($('#fruits').contents()[5]);
    });

it('-233-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $fruits.after($plum);
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.insertAfter', function () {
it('-234-(selector) : should create element and add as next sibling', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertAfter('.apple');
      expect($('.apple').next().hasClass('grape')).to.be.ok();
    });

it('-235-(selector) : should create element and add as next sibling of multiple elements', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertAfter('.apple, .pear');
      expect($('.apple').next().hasClass('grape')).to.be.ok();
      expect($('.pear').next().hasClass('grape')).to.be.ok();
    });

it('-236-($(...)) : should create element and add as next sibling', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertAfter($('.apple'));
      expect($('.apple').next().hasClass('grape')).to.be.ok();
    });

it('-237-($(...)) : should create element and add as next sibling of multiple elements', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertAfter($('.apple, .pear'));
      expect($('.apple').next().hasClass('grape')).to.be.ok();
      expect($('.pear').next().hasClass('grape')).to.be.ok();
    });

it('-238-($(...)) : should create all elements in the array and add as next siblings', function () {
      var more = $('<li class="plum">Plum</li><li class="grape">Grape</li>');
      more.insertAfter($('.apple'));
      expect($fruits.children().eq(0).hasClass('apple')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(2).hasClass('grape')).to.be.ok();
    });

it('-239-(existing Node) : should remove existing nodes from previous locations', function () {
      $('.orange').insertAfter('.pear');
      expect($fruits.children().eq(1).hasClass('orange')).to.not.be.ok();
      expect($fruits.children().length).to.be(3);
      expect($('.orange').length).to.be(1);
    });

it('-240-(existing Node) : should update original direct siblings', function () {
      $('.orange').insertAfter('.pear');
      expect($('.apple').next().hasClass('pear')).to.be.ok();
      expect($('.pear').prev().hasClass('apple')).to.be.ok();
      expect($('.pear').next().hasClass('orange')).to.be.ok();
      expect($('.orange').next()).to.be.empty();
    });

it('-241-(existing Node) : should update original direct siblings of multiple elements', function () {
      $('.apple').insertAfter('.orange, .pear');
      expect($('.orange').prev()).to.be.empty();
      expect($('.orange').next().hasClass('apple')).to.be.ok();
      expect($('.pear').next().hasClass('apple')).to.be.ok();
      expect($('.pear').prev().hasClass('apple')).to.be.ok();
      expect($fruits.children().length).to.be(4);
      var apples = $('.apple');
      expect(apples.length).to.be(2);
      expect(apples.eq(0).prev().hasClass('orange')).to.be.ok();
      expect(apples.eq(1).prev().hasClass('pear')).to.be.ok();
    });

it('-242-(elem) : should handle if removed', function () {
      var $apple = $('.apple');
      var $plum = $('<li class="plum">Plum</li>');
      $apple.remove();
      $plum.insertAfter($apple);
      expect($plum.prev()).to.be.empty();
    });

it('-243-(single) should return the new element for chaining', function () {
      var $grape = $('<li class="grape">Grape</li>').insertAfter('.apple');
      expect($grape.cheerio).to.be.ok();
      expect($grape.each).to.be.ok();
      expect($grape.length).to.be(1);
      expect($grape.hasClass('grape')).to.be.ok();
    });

it('-244-(single) should return the new elements for chaining', function () {
      var $purple = $(
        '<li class="grape">Grape</li><li class="plum">Plum</li>'
      ).insertAfter('.apple');
      expect($purple.cheerio).to.be.ok();
      expect($purple.each).to.be.ok();
      expect($purple.length).to.be(2);
      expect($purple.eq(0).hasClass('grape')).to.be.ok();
      expect($purple.eq(1).hasClass('plum')).to.be.ok();
    });

it('-245-(multiple) should return the new elements for chaining', function () {
      var $purple = $(
        '<li class="grape">Grape</li><li class="plum">Plum</li>'
      ).insertAfter('.apple, .pear');
      expect($purple.cheerio).to.be.ok();
      expect($purple.each).to.be.ok();
      expect($purple.length).to.be(4);
      expect($purple.eq(0).hasClass('grape')).to.be.ok();
      expect($purple.eq(1).hasClass('plum')).to.be.ok();
      expect($purple.eq(2).hasClass('grape')).to.be.ok();
      expect($purple.eq(3).hasClass('plum')).to.be.ok();
    });

it('-246-(single) should return the existing element for chaining', function () {
      var $pear = $('.pear').insertAfter('.apple');
      expect($pear.cheerio).to.be.ok();
      expect($pear.each).to.be.ok();
      expect($pear.length).to.be(1);
      expect($pear.hasClass('pear')).to.be.ok();
    });

it('-247-(single) should return the existing elements for chaining', function () {
      var $things = $('.orange, .apple').insertAfter('.pear');
      expect($things.cheerio).to.be.ok();
      expect($things.each).to.be.ok();
      expect($things.length).to.be(2);
      expect($things.eq(0).hasClass('apple')).to.be.ok();
      expect($things.eq(1).hasClass('orange')).to.be.ok();
    });

it('-248-(multiple) should return the existing elements for chaining', function () {
      $('<li class="grape">Grape</li>').insertAfter('.apple');
      var $things = $('.orange, .apple').insertAfter('.pear, .grape');
      expect($things.cheerio).to.be.ok();
      expect($things.each).to.be.ok();
      expect($things.length).to.be(4);
      expect($things.eq(0).hasClass('apple')).to.be.ok();
      expect($things.eq(1).hasClass('orange')).to.be.ok();
      expect($things.eq(2).hasClass('apple')).to.be.ok();
      expect($things.eq(3).hasClass('orange')).to.be.ok();
    });
  });

  describe('.before', function () {
it('-249-() : should do nothing', function () {
      expect($('#fruits').before()[0].tagName).to.equal('ul');
    });

it('-250-(html) : should add element as previous sibling', function () {
      var grape = '<li class="grape">Grape</li>';
      $('.apple').before(grape);
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
    });

it('-251-($(...)) : should add element as previous sibling', function () {
      var $plum = $('<li class="plum">Plum</li>');
      $('.apple').before($plum);
      expect($('.apple').prev().hasClass('plum')).to.be.ok();
    });

it('-252-(Node) : should add element as previous sibling', function () {
      var plum = $('<li class="plum">Plum</li>')[0];
      $('.apple').before(plum);
      expect($('.apple').prev().hasClass('plum')).to.be.ok();
    });

it('-253-(existing Node) : should remove existing nodes from previous locations', function () {
      var pear = $fruits.children()[2];
      var $children;

      $('.apple').before(pear);

      $children = $fruits.children();
      expect($children).to.have.length(3);
      expect($children[0]).to.be(pear);
    });

it('-254-(existing Node) : should update original direct siblings', function () {
      $('.apple').before($('.orange'));
      expect($('.apple').next()[0]).to.be($('.pear')[0]);
      expect($('.pear').prev()[0]).to.be($('.apple')[0]);
    });

it('-255-(existing Node) : should clone all but the last occurrence', function () {
      var $originalPear = $('.pear');
      $('.apple, .orange').before($originalPear);

      expect($('.pear')).to.have.length(2);
      expect($('.pear').eq(0).prev()).to.have.length(0);
      expect($('.pear').eq(0).next()[0]).to.be($('.apple')[0]);
      expect($('.pear').eq(1).prev()[0]).to.be($('.apple')[0]);
      expect($('.pear').eq(1).next()[0]).to.be($('.orange')[0]);
      expect($('.pear')[0]).to.not.eql($originalPear[0]);
      expect($('.pear')[1]).to.eql($originalPear[0]);
    });

it('-256-(elem) : should handle if removed', function () {
      var $apple = $('.apple');
      var $plum = $('<li class="plum">Plum</li>');

      $apple.remove();
      $apple.before($plum);
      expect($plum.next()).to.be.empty();
    });

it('-257-(Array) : should add all elements in the array as previous sibling', function () {
      var more = $(
        '<li class="plum">Plum</li><li class="grape">Grape</li>'
      ).get();
      $('.apple').before(more);
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('grape')).to.be.ok();
    });

it('-258-($(...), html) : should add multiple elements as previous siblings', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var grape = '<li class="grape">Grape</li>';
      $('.apple').before($plum, grape);
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
      expect($('.grape').prev().hasClass('plum')).to.be.ok();
    });

it('-259-(fn) : should invoke the callback with the correct arguments and context', function () {
      var args = [];
      var thisValues = [];
      $fruits = $fruits.children();

      $fruits.before(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
      });

      expect(args).to.eql([
        [0, 'Apple'],
        [1, 'Orange'],
        [2, 'Pear'],
      ]);
      expect(thisValues).to.eql([$fruits[0], $fruits[1], $fruits[2]]);
    });

it('-260-(fn) : should add returned string as previous sibling', function () {
      $fruits = $fruits.children();

      $fruits.before(function () {
        return '<li class="first">';
      });

      expect($('.first')[0]).to.equal($('#fruits').contents()[0]);
      expect($('.first')[1]).to.equal($('#fruits').contents()[2]);
      expect($('.first')[2]).to.equal($('#fruits').contents()[4]);
    });

it('-261-(fn) : should add returned Cheerio object as previous sibling', function () {
      $fruits = $fruits.children();

      $fruits.before(function () {
        return $('<li class="second">');
      });

      expect($('.second')[0]).to.equal($('#fruits').contents()[0]);
      expect($('.second')[1]).to.equal($('#fruits').contents()[2]);
      expect($('.second')[2]).to.equal($('#fruits').contents()[4]);
    });

it('-262-(fn) : should add returned Node as previous sibling', function () {
      $fruits = $fruits.children();

      $fruits.before(function () {
        return $('<li class="third">')[0];
      });

      expect($('.third')[0]).to.equal($('#fruits').contents()[0]);
      expect($('.third')[1]).to.equal($('#fruits').contents()[2]);
      expect($('.third')[2]).to.equal($('#fruits').contents()[4]);
    });

it('-263-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $fruits.before($plum);
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.insertBefore', function () {
it('-264-(selector) : should create element and add as prev sibling', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertBefore('.apple');
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
    });

it('-265-(selector) : should create element and add as prev sibling of multiple elements', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertBefore('.apple, .pear');
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
      expect($('.pear').prev().hasClass('grape')).to.be.ok();
    });

it('-266-($(...)) : should create element and add as prev sibling', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertBefore($('.apple'));
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
    });

it('-267-($(...)) : should create element and add as next sibling of multiple elements', function () {
      var grape = $('<li class="grape">Grape</li>');
      grape.insertBefore($('.apple, .pear'));
      expect($('.apple').prev().hasClass('grape')).to.be.ok();
      expect($('.pear').prev().hasClass('grape')).to.be.ok();
    });

it('-268-($(...)) : should create all elements in the array and add as prev siblings', function () {
      var more = $('<li class="plum">Plum</li><li class="grape">Grape</li>');
      more.insertBefore($('.apple'));
      expect($fruits.children().eq(0).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(1).hasClass('grape')).to.be.ok();
      expect($fruits.children().eq(2).hasClass('apple')).to.be.ok();
    });

it('-269-(existing Node) : should remove existing nodes from previous locations', function () {
      $('.pear').insertBefore('.apple');
      expect($fruits.children().eq(2).hasClass('pear')).to.not.be.ok();
      expect($fruits.children().length).to.be(3);
      expect($('.pear').length).to.be(1);
    });

it('-270-(existing Node) : should update original direct siblings', function () {
      $('.pear').insertBefore('.apple');
      expect($('.apple').prev().hasClass('pear')).to.be.ok();
      expect($('.apple').next().hasClass('orange')).to.be.ok();
      expect($('.pear').next().hasClass('apple')).to.be.ok();
      expect($('.pear').prev()).to.be.empty();
    });

it('-271-(existing Node) : should update original direct siblings of multiple elements', function () {
      $('.pear').insertBefore('.apple, .orange');
      expect($('.apple').prev().hasClass('pear')).to.be.ok();
      expect($('.apple').next().hasClass('pear')).to.be.ok();
      expect($('.orange').prev().hasClass('pear')).to.be.ok();
      expect($('.orange').next()).to.be.empty();
      expect($fruits.children().length).to.be(4);
      var pears = $('.pear');
      expect(pears.length).to.be(2);
      expect(pears.eq(0).next().hasClass('apple')).to.be.ok();
      expect(pears.eq(1).next().hasClass('orange')).to.be.ok();
    });

it('-272-(elem) : should handle if removed', function () {
      var $apple = $('.apple');
      var $plum = $('<li class="plum">Plum</li>');

      $apple.remove();
      $plum.insertBefore($apple);
      expect($plum.next()).to.be.empty();
    });

it('-273-(single) should return the new element for chaining', function () {
      var $grape = $('<li class="grape">Grape</li>').insertBefore('.apple');
      expect($grape.cheerio).to.be.ok();
      expect($grape.each).to.be.ok();
      expect($grape.length).to.be(1);
      expect($grape.hasClass('grape')).to.be.ok();
    });

it('-274-(single) should return the new elements for chaining', function () {
      var $purple = $(
        '<li class="grape">Grape</li><li class="plum">Plum</li>'
      ).insertBefore('.apple');
      expect($purple.cheerio).to.be.ok();
      expect($purple.each).to.be.ok();
      expect($purple.length).to.be(2);
      expect($purple.eq(0).hasClass('grape')).to.be.ok();
      expect($purple.eq(1).hasClass('plum')).to.be.ok();
    });

it('-275-(multiple) should return the new elements for chaining', function () {
      var $purple = $(
        '<li class="grape">Grape</li><li class="plum">Plum</li>'
      ).insertBefore('.apple, .pear');
      expect($purple.cheerio).to.be.ok();
      expect($purple.each).to.be.ok();
      expect($purple.length).to.be(4);
      expect($purple.eq(0).hasClass('grape')).to.be.ok();
      expect($purple.eq(1).hasClass('plum')).to.be.ok();
      expect($purple.eq(2).hasClass('grape')).to.be.ok();
      expect($purple.eq(3).hasClass('plum')).to.be.ok();
    });

it('-276-(single) should return the existing element for chaining', function () {
      var $orange = $('.orange').insertBefore('.apple');
      expect($orange.cheerio).to.be.ok();
      expect($orange.each).to.be.ok();
      expect($orange.length).to.be(1);
      expect($orange.hasClass('orange')).to.be.ok();
    });

it('-277-(single) should return the existing elements for chaining', function () {
      var $things = $('.orange, .pear').insertBefore('.apple');
      expect($things.cheerio).to.be.ok();
      expect($things.each).to.be.ok();
      expect($things.length).to.be(2);
      expect($things.eq(0).hasClass('orange')).to.be.ok();
      expect($things.eq(1).hasClass('pear')).to.be.ok();
    });

it('-278-(multiple) should return the existing elements for chaining', function () {
      $('<li class="grape">Grape</li>').insertBefore('.apple');
      var $things = $('.orange, .apple').insertBefore('.pear, .grape');
      expect($things.cheerio).to.be.ok();
      expect($things.each).to.be.ok();
      expect($things.length).to.be(4);
      expect($things.eq(0).hasClass('apple')).to.be.ok();
      expect($things.eq(1).hasClass('orange')).to.be.ok();
      expect($things.eq(2).hasClass('apple')).to.be.ok();
      expect($things.eq(3).hasClass('orange')).to.be.ok();
    });
  });

  describe('.remove', function () {
it('-279-() : should remove selected elements', function () {
      $('.apple').remove();
      expect($fruits.find('.apple')).to.have.length(0);
    });

it('-280-() : should be reentrant', function () {
      var $apple = $('.apple');
      $apple.remove();
      $apple.remove();
      expect($fruits.find('.apple')).to.have.length(0);
    });

it('-281-(selector) : should remove matching selected elements', function () {
      $('li').remove('.apple');
      expect($fruits.find('.apple')).to.have.length(0);
    });

it('-282-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $plum.remove();
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.replaceWith', function () {
it('-283-(elem) : should replace one <li> tag with another', function () {
      var $plum = $('<li class="plum">Plum</li>');
      $('.pear').replaceWith($plum);
      expect($('.orange').next().hasClass('plum')).to.be.ok();
      expect($('.orange').next().html()).to.equal('Plum');
    });

it('-284-(Array) : should replace one <li> tag with the elements in the array', function () {
      var more = $(
        '<li class="plum">Plum</li><li class="grape">Grape</li>'
      ).get();
      $('.pear').replaceWith(more);

      expect($fruits.children().eq(2).hasClass('plum')).to.be.ok();
      expect($fruits.children().eq(3).hasClass('grape')).to.be.ok();
      expect($fruits.children()).to.have.length(4);
    });

it('-285-(Node) : should replace the selected element with given node', function () {
      var $src = $('<h2>hi <span>there</span></h2>');
      var $new = $('<ul></ul>');
      var $replaced = $src.find('span').replaceWith($new[0]);
      expect($new[0].parentNode).to.equal($src[0]);
      expect($replaced[0].parentNode).to.equal(null);
      expect($.html($src)).to.equal('<h2>hi <ul></ul></h2>');
    });

it('-286-(existing element) : should remove element from its previous location', function () {
      $('.pear').replaceWith($('.apple'));
      expect($fruits.children()).to.have.length(2);
      expect($fruits.children()[0]).to.equal($('.orange')[0]);
      expect($fruits.children()[1]).to.equal($('.apple')[0]);
    });

it('-287-(elem) : should NOP if removed', function () {
      var $pear = $('.pear');
      var $plum = $('<li class="plum">Plum</li>');

      $pear.remove();
      $pear.replaceWith($plum);
      expect($('.orange').next().hasClass('plum')).to.not.be.ok();
    });

it('-288-(elem) : should replace the single selected element with given element', function () {
      var $src = $('<h2>hi <span>there</span></h2>');
      var $new = $('<div>here</div>');
      var $replaced = $src.find('span').replaceWith($new);
      expect($new[0].parentNode).to.equal($src[0]);
      expect($replaced[0].parentNode).to.equal(null);
      expect($.html($src)).to.equal('<h2>hi <div>here</div></h2>');
    });

it('-289-(str) : should accept strings', function () {
      var $src = $('<h2>hi <span>there</span></h2>');
      var newStr = '<div>here</div>';
      var $replaced = $src.find('span').replaceWith(newStr);
      expect($replaced[0].parentNode).to.equal(null);
      expect($.html($src)).to.equal('<h2>hi <div>here</div></h2>');
    });

it('-290-(str) : should replace all selected elements', function () {
      var $src = $('<b>a<br>b<br>c<br>d</b>');
      var $replaced = $src.find('br').replaceWith(' ');
      expect($replaced[0].parentNode).to.equal(null);
      expect($.html($src)).to.equal('<b>a b c d</b>');
    });

it('-291-(fn) : should invoke the callback with the correct argument and context', function () {
      var origChildren = $fruits.children().get();
      var args = [];
      var thisValues = [];

      $fruits.children().replaceWith(function () {
        args.push(toArray(arguments));
        thisValues.push(this);
        return '<li class="first">';
      });

      expect(args).to.eql([
        [0, origChildren[0]],
        [1, origChildren[1]],
        [2, origChildren[2]],
      ]);
      expect(thisValues).to.eql([
        origChildren[0],
        origChildren[1],
        origChildren[2],
      ]);
    });

it('-292-(fn) : should replace the selected element with the returned string', function () {
      $fruits.children().replaceWith(function () {
        return '<li class="first">';
      });

      expect($fruits.find('.first')).to.have.length(3);
    });

it('-293-(fn) : should replace the selected element with the returned Cheerio object', function () {
      $fruits.children().replaceWith(function () {
        return $('<li class="second">');
      });

      expect($fruits.find('.second')).to.have.length(3);
    });

it('-294-(fn) : should replace the selected element with the returned node', function () {
      $fruits.children().replaceWith(function () {
        return $('<li class="third">')[0];
      });

      expect($fruits.find('.third')).to.have.length(3);
    });

it('-295-($(...)) : should remove from root element', function () {
      var $plum = $('<li class="plum">Plum</li>');
      var root = $plum[0].root;
      expect(root).to.be.ok();

      $fruits.children().replaceWith($plum);
      expect($plum[0].root).to.not.be.ok();
      expect(root.childNodes).to.not.contain($plum[0]);
    });
  });

  describe('.empty', function () {
it('-296-() : should remove all children from selected elements', function () {
      expect($fruits.children()).to.have.length(3);

      $fruits.empty();
      expect($fruits.children()).to.have.length(0);
    });

it('-297-() : should allow element reinsertion', function () {
      var $children = $fruits.children();

      $fruits.empty();
      expect($fruits.children()).to.have.length(0);
      expect($children).to.have.length(3);

      $fruits.append($('<div></div><div></div>'));
      var $remove = $fruits.children().eq(0);

      $remove.replaceWith($children);
      expect($fruits.children()).to.have.length(4);
    });

it("-298-() : should destroy children's references to the parent", function () {
      var $children = $fruits.children();

      $fruits.empty();

      expect($children.eq(0).parent()).to.have.length(0);
      expect($children.eq(0).next()).to.have.length(0);
      expect($children.eq(0).prev()).to.have.length(0);
      expect($children.eq(1).parent()).to.have.length(0);
      expect($children.eq(1).next()).to.have.length(0);
      expect($children.eq(1).prev()).to.have.length(0);
      expect($children.eq(2).parent()).to.have.length(0);
      expect($children.eq(2).next()).to.have.length(0);
      expect($children.eq(2).prev()).to.have.length(0);
    });
  });

  describe('.html', function () {
it('-299-() : should get the innerHTML for an element', function () {
      expect($fruits.html()).to.equal(
        [
          '<li class="apple">Apple</li>',
          '<li class="orange">Orange</li>',
          '<li class="pear">Pear</li>',
        ].join('')
      );
    });

it('-300-() : should get innerHTML even if its just text', function () {
      var item = '<li class="pear">Pear</li>';
      expect($('.pear', item).html()).to.equal('Pear');
    });

it('-301-() : should return empty string if nothing inside', function () {
      var item = '<li></li>';
      expect($('li', item).html()).to.equal('');
    });

it('-302-(html) : should set the html for its children', function () {
      $fruits.html('<li class="durian">Durian</li>');
      var html = $fruits.html();
      expect(html).to.equal('<li class="durian">Durian</li>');
    });

it('-303-(html) : should add new elements for each element in selection', function () {
      $fruits = $('li');
      $fruits.html('<li class="durian">Durian</li>');
      var tested = 0;
      $fruits.each(function () {
        expect($(this).children().parent().get(0)).to.equal(this);
        tested++;
      });
      expect(tested).to.equal(3);
    });

it('-304-(elem) : should set the html for its children with element', function () {
      $fruits.html($('<li class="durian">Durian</li>'));
      var html = $fruits.html();
      expect(html).to.equal('<li class="durian">Durian</li>');
    });

it('-305-() : should allow element reinsertion', function () {
      var $children = $fruits.children();

      $fruits.html('<div></div><div></div>');
      expect($fruits.children()).to.have.length(2);

      var $remove = $fruits.children().eq(0);

      $remove.replaceWith($children);
      expect($fruits.children()).to.have.length(4);
    });
  });

  describe('.toString', function () {
it('-306-() : should get the outerHTML for an element', function () {
      expect($fruits.toString()).to.equal(fruits);
    });

it('-307-() : should return an html string for a set of elements', function () {
      expect($fruits.find('li').toString()).to.equal(
        '<li class="apple">Apple</li><li class="orange">Orange</li><li class="pear">Pear</li>'
      );
    });

it('-308-() : should be called implicitly', function () {
      var string = [$('<foo>'), $('<bar>'), $('<baz>')].join('');
      expect(string).to.equal('<foo></foo><bar></bar><baz></baz>');
    });

it('-309-() : should pass options', function () {
      var dom = cheerio.load('&', { xml: { decodeEntities: false } });
      expect(dom.root().toString()).to.equal('&');
    });
  });

  describe('.text', function () {
it('-310-() : gets the text for a single element', function () {
      expect($('.apple').text()).to.equal('Apple');
    });

it('-311-() : combines all text from children text nodes', function () {
      expect($('#fruits').text()).to.equal('AppleOrangePear');
    });

it('-312-(text) : sets the text for the child node', function () {
      $('.apple').text('Granny Smith Apple');
      expect($('.apple')[0].childNodes[0].data).to.equal('Granny Smith Apple');
    });

it('-313-(text) : inserts separate nodes for all children', function () {
      $('li').text('Fruits');
      var tested = 0;
      $('li').each(function () {
        expect(this.childNodes[0].parentNode).to.equal(this);
        tested++;
      });
      expect(tested).to.equal(3);
    });

it('-314-(text) : should create a Node with the DOM level 1 API', function () {
      var $apple = $('.apple');
      var textNode;

      $apple.text('anything');
      textNode = $apple[0].childNodes[0];

      expect(textNode.parentNode).to.be($apple[0]);
      expect(textNode.nodeType).to.be(3);
      expect(textNode.data).to.be('anything');
    });

it('-315-should allow functions as arguments', function () {
      $('.apple').text(function (idx, content) {
        expect(idx).to.equal(0);
        expect(content).to.equal('Apple');
        return 'whatever mate';
      });
      expect($('.apple')[0].childNodes[0].data).to.equal('whatever mate');
    });

it('-316-should allow functions as arguments for multiple elements', function () {
      $('li').text(function (idx) {
        return 'text' + idx;
      });
      $('li').each(function (idx) {
        expect(this.childNodes[0].data).to.equal('text' + idx);
      });
    });

it('-317-should decode special chars', function () {
      var text = $('<p>M&amp;M</p>').text();
      expect(text).to.equal('M&M');
    });

it('-318-should work with special chars added as strings', function () {
      var text = $('<p>M&M</p>').text();
      expect(text).to.equal('M&M');
    });

it('-319-( undefined ) : should act as an accessor', function () {
      var $div = $('<div>test</div>');
      expect($div.text(undefined)).to.be.a('string');
      expect($div.text()).to.be('test');
    });

it('-320-( "" ) : should convert to string', function () {
      var $div = $('<div>test</div>');
      expect($div.text('').text()).to.equal('');
    });

it('-321-( null ) : should convert to string', function () {
      expect($('<div>').text(null).text()).to.equal('null');
    });

it('-322-( 0 ) : should convert to string', function () {
      expect($('<div>').text(0).text()).to.equal('0');
    });

it('-323-(str) should encode then decode unsafe characters', function () {
      var $apple = $('.apple');

      $apple.text('blah <script>alert("XSS!")</script> blah');
      expect($apple[0].childNodes[0].data).to.equal(
        'blah <script>alert("XSS!")</script> blah'
      );
      expect($apple.text()).to.equal(
        'blah <script>alert("XSS!")</script> blah'
      );

      $apple.text('blah <script>alert("XSS!")</script> blah');
      expect($apple.html()).to.not.contain('<script>alert("XSS!")</script>');
    });
  });
});
