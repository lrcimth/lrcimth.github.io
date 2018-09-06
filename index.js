var animationSpeed = 750;
var library = [];

$(document).ready(function(){
    fillLibrary();
    attachAnimations();    
});

/* -----------------------------------------------------------------------------
    FILL PAGE HTML 
   ---------------------------------------------------------------------------*/
function fillLibrary() {
    assembleData();
    var classlist = ['left-side first','left-side','left-side','right-side','right-side','right-side last'];
        for (i=0; i < library.length; i++) {
            var book = library[i];
            // add html for current book
            var html = '<li class="book ' + classlist[0] + '">';
            html += '<div class="cover"><img src="' + book.cover + '" /></div>';
            html += '<div class="summary">';
            html += '<h1>' + book.title + '</h1>';
            html += '<h2>by ' + book.author + '</h2>';
            html += '<p>' + book.abstract + '</p>';
            html += '</div></li>';
            $('.library').append(html);
            // shift the classlist array for the next iteration
            var cn = classlist.shift();
            classlist.push(cn);
        }
   
}
/* -----------------------------------------------------------------------------
    ANIMATION 
   ---------------------------------------------------------------------------*/
function attachAnimations() {
    $('.book').click(function(){
        if (!$(this).hasClass('selected')) {
            selectAnimation($(this));
        }
    });
    $('.book .cover').click(function(){
        if ($(this).parent().hasClass('selected')) {
           deselectAnimation($(this).parent());
        }
    });
}

function selectAnimation(obj) {
    obj.addClass('selected');
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // animate book cover
    cover.animate({
        width: '300px',
        height: '468px' 
    }, {
        duration: animationSpeed
    });
    image.animate({
        width: '280px',
        height: '448px',
        borderWidth: '10px'
    },{
        duration: animationSpeed
    });
    // add fix if the selected item is in the bottom row
    if (isBtmRow()){
      library.css('paddingBottom','234px');
    }
    // slide page so book always appears
    positionTop();
    // add background overlay
    $('.overlay-page').show();
    // locate summary overlay    
    var px = overlayVertPos();
    summaryBG.css('left',px);
    // animate summary elements
    var ht = $('.content').height();
    var pos = $('.book.selected').position();
    var start = pos.top + 30; // 10px padding-top on .book + 20px padding of .summary
    var speed = Math.round((animationSpeed/ht) * 450); // 450 is goal height
    summaryBG.show().animate({
        height: ht + 'px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now > start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() < 450){
                    summary.show().animate({
                        height: '450px'
                    },{
                        duration: speed,
                        easing: 'linear'
                    });
                }
                
            }
        } 
        
    });
}

function deselectAnimation(obj) {
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // stop summary animation
    summary.stop();
    // animate book cover
    cover.stop().animate({
        width: '140px',
        height: '224px' 
    },{
        duration:animationSpeed
    });
    image.stop().animate({
        width: '140px',
        height: '224px',
        borderWidth: '0px'
    },{
        duration: animationSpeed,
        complete: function() {
            obj.removeClass('selected');
        }
    });
    // remove fix for bottom row, if present
    library.stop().animate({
        paddingBottom:'10px'
    },{ 
        duration: animationSpeed
    });
    // remove background overlay and summary
    var ht = summaryBG.height();
    var pos = $('.book.selected').position();
    var start = pos.top + 480; //10px of top padding + 470px for .summary height + padding
    var speed = Math.round((animationSpeed/ht) * summary.height());
    summaryBG.stop().animate({
        height: '0px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now < start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() > 0){
                    summary.animate({
                        height: '0px'
                    },{ 
                        duration: speed,
                        easing: 'linear',
                        complete: function(){
                            summary.hide(); 
                        }
                    });
                }
                
            }
        }, 
        complete: function(){
            $('.overlay-page').hide();
            summary.hide(); // catching this twice to insure for aborted animation
            summaryBG.hide();
        }
    });
}

function isBtmRow() {
    var pos = $('.book.selected').position();
    var libHgt = $('.content').height();
    if (libHgt-pos.top===254) { // this is current height of the book, plus 30 for padding on the book and library
        return true;
    } else {
        return false;
    }
}

function positionTop() { 
   var offset = $('.book.selected').offset();
   var bTop = offset.top;
   $('html, body').animate({ scrollTop: bTop }, animationSpeed);
}

function overlayVertPos() { // determines the vertical position for the summary overlay based on selection position
    var pos = $('.book.selected').position();
    switch(pos.left) {
        case 0:
            return '320px';
        case 160:
            return '320px';
        case 320:
            return '480px';
        case 480:
            return '0px';
        case 640:
            return '160px';
        case 800:
            return '160px';
        default:
            return false;
    }
}
/* -----------------------------------------------------------------------------
    BUILD LIBRARY ARRAY 
   ---------------------------------------------------------------------------*/
function Book(cover,title,author,abstract) {
    this.cover = cover;
    this.title = title;
    this.author = author;
    this.abstract = abstract;
    library.push(this);
}

function assembleData() {
    var book;
    book = new Book('https://d1ldz4te4covpm.cloudfront.net/sites/default/files/8637OS_3722_Mastering%20Python%20Machine%20Learning.jpg','Advanced Machine Learning with Python','John Hearty','Designed to take you on a guided tour of the most relevant and powerful machine learning techniques in use today by top data scientists, this book is just what you need to push your Python algorithms to maximum potential. Clear examples and detailed code samples demonstrate deep learning techniques, semi-supervised learning, and more - all whilst working with real-world applications that include image, music, text, and financial data.The machine learning techniques covered in this book are at the forefront of commercial practice. They are applicable now for the first time in contexts such as image recognition, NLP and web search, computational creativity, and commercial/financial data modeling. Deep Learning algorithms and ensembles of models are in use by data scientists at top tech and digital companies, but the skills needed to apply them successfully, while in high demand, are still scarce.');
    book = new Book('https://images.gr-assets.com/books/1324199832l/12404631.jpg','Machine Learning in Action','Peter Harrington','“Machine Learning in Action” is a unique book that blends the foundational theories of machine learning with the practical realities of building tools for everyday data analysis. In it, you will use the flexible Python programming language to build programs that implement algorithms for data classification, forecasting, recommendations, and higher-level features like summarization and simplification. As you work through the numerous examples, you will explore key topics like classification, numeric prediction, and clustering. Along the way, you will be introduced to important established algorithms, such as Apriori, through which you identify association patterns in large datasets and Adaboost, a meta-algorithm that can increase the efficiency of many machine learning tasks. This book is written for hobbyists and developers. A background in Java is helpful-no prior experience with Android is assumed.');
    book = new Book('https://images-na.ssl-images-amazon.com/images/I/41vKG7RVUIL._BO1,204,203,200_.jpg','Introduction To Machine Learning With Python: A Guide For Data Scientists','Andreas Muller, Sarah Guido','Machine learning has become an integral part of many commercial applications and research projects, but this field is not exclusive to large companies with extensive research teams. If you use Python, even as a beginner, this book will teach you practical ways to build your own machine learning solutions. With all the data available today, machine learning applications are limited only by your imagination. You will learn the steps necessary to create a successful machine-learning application with Python and the scikit-learn library. Authors Andreas Muller and Sarah Guido focus on the practical aspects of using machine learning algorithms, rather than the math behind them. Familiarity with the NumPy and matplotlib libraries will help you get even more from this book.');
    book = new Book('https://images-na.ssl-images-amazon.com/images/I/41EXC4JusKL.jpg','Python Data Science Handbook: Essential Tools for Working with Data','Jake VanderPlas','For many researchers, Python is a first-class tool mainly because of its libraries for storing, manipulating, and gaining insight from data. Several resources exist for individual pieces of this data science stack, but only with the Python Data Science Handbook do you get them all. IPython, NumPy, Pandas, Matplotlib, Scikit-Learn, and other related tools.Working scientists and data crunchers familiar with reading and writing Python code will find this comprehensive desk reference ideal for tackling day-to-day issues: manipulating, transforming, and cleaning data; visualizing different types of data; and using data to build statistical or machine learning models. Quite simply, this is the must-have reference for scientific computing in Python.With this handbook, you will learn how to use: -IPython and Jupyter: provide computational environments for data scientists using Python -NumPy: includes the ndarray for efficient storage and manipulation of dense data arrays in Python -Pandas: features the DataFrame for efficient storage and manipulation of labeled/columnar data in Python -Matplotlib: includes capabilities for a flexible range of data visualizations in Python -Scikit-Learn: for efficient and clean Python implementations of the most important and established machine learning algorithms.');
    book = new Book('http://static.meripustak.com/FullImage/SEBI-Manual-(Three-Volumes-SEBI-Manual-(Three-Volumes-Set))_151870.jpg','SEBI Manual (Set of Three Volumes)','Taxmann','VOL 1-SEBI ( Issue of Capital and Disclosure Requirements) Regulations 2009,SEBI Act 1992,Securities Contracts ( Regulation) Act 1956 with Rules/Regulations,SEBI Rules/Regulations/Circulars& Guidelines. VOL 2- SEBI Rules/Regulations/Circulars & Guidelines for Foreign Portfolio Investors, Forward Contracts, Infrastructure Investment Trust, Insider Trading, Investor Protection, etc. VOL 3- Securities Appellate Tribunal, Securities Transaction Tax, Settlement of Administrative and Civil Proceedings, etc.');
    book = new Book('https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9789/3860/9789386042415.jpg','Winning on HR Analytics: Leveraging Data for Competitive Advantage','Ramesh Soundararajan, Kuldeep Singh','In a dynamic world, the role of HR is central in tapping the vast potential of human capital, and interestingly, blending it with automation and digitization in unique ways. HR analytics is pivotal in identifying, measuring and articulating the objectives and outcomes of different programs. What if you can: • Predict which high performers were at risk of leaving six months before they walked out the door? • Merge external data with your own business metrics to project workforce demand six, nine or even eighteen months from now? • Triage incoming resumes overnight to predict employee success and tenure before you hire? All this and more is possible with sophisticated technology and analytics as demonstrated by companies such as Google, Walmart, and American Express. To leverage analytics, you need to walk a path through reliable data, techniques of analysis, and formulation of hypothesis. This book is a practical, do it yourself handbook to convert analytics into an area of strength and maintain competitive advantage..');
    book = new Book('https://images-na.ssl-images-amazon.com/images/I/81e5NL8y6RL.jpg','Programming Collective Intelligence: Building Smart Web 2.0 Applications','Toby Segaran','Programming Collective Intelligence takes you into the world of machine learning and statistics, and explains how to draw conclusions about user experience, marketing, personal tastes, and human behavior in general ‐‐ all from information that you and others collect every day. Each algorithm is described clearly and concisely with code that can immediately be used on your web site, blog, Wiki, or specialized application. This book explains: Collaborative filtering techniques that enable online retailers to recommend products or mediaM ethods of clustering to detect groups of similar items in a large dataset Search engine features ‐‐crawlers, indexers, query engines, and the PageRank algorithm Optimization algorithms that search millions of possible solutions to a problem and choose the best oneB ayesian filtering, used in spam filters for classifying documents based on word types and other features Using decision trees not only to make predictions, but to model the way decisions are made Predicting numerical values rather than classifications to build price models Support vector machines to match people in online dating sites Non‐negative matrix factorization to find the independent features in a datasetE volving intelligence for problem solving ‐‐ how a computer develops its skill by improving its own code the more it plays a game.');
    book = new Book('https://cdn.penguin.co.in/wp-content/uploads/2018/06/5b2871d0267c9-254x405.jpg','India Moving: A History of Migration','Chinmay Tumbe','From adventure to indenture, martyrs to merchants, Partition to plantation, from Kashmir to Kerala, Japan to Jamaica and beyond, the many facets of the great migrations of India and the world are mapped in India Moving, the first book of its kind. To understand how millions of people have moved-from, to and within India-the book embarks on a journey laced with evidence, argument and wit, providing insights into topics like the slave trade and migration of workers, travelling business communities such as the Marwaris, Gujaratis and Chettiars, refugee crises and the roots of contemporary mass migration from Bihar and Kerala, covering terrain that often includes diverse items such as mangoes, dosas and pressure cookers. India Moving shows the scale and variety of Indian migration and argues that greater mobility is a prerequisite for maintaining the country;s pluralistic traditions.');
    book = new Book('https://blackwells.co.uk/jacket/l/9781484232064.jpg','Practical Machine Learning with Python:A Problem-Solver;s Guide to Building Real-World Intelligent Systems','Dipanjan Sarkar, Raghav Bali, Tushar Sharma','Master the essential skills needed to recognize and solve complex problems with machine learning and deep learning. Using real-world examples that leverage the popular Python machine learning ecosystem, this book is your perfect companion for learning the art and science of machine learning to become a successful practitioner. The concepts, techniques, tools, frameworks, and methodologies used in this book will teach you how to think, design, build, and execute machine learning systems and projects successfully. Part 1 focuses on understanding machine learning concepts and tools. Part 2 details standard machine learning pipelines, with an emphasis on data processing analysis, feature engineering, and modeling. art 3 explores multiple real-world case studies spanning diverse domains and industries like retail, transportation, movies, music, marketing, computer vision and finance.');
    book = new Book('https://images-na.ssl-images-amazon.com/images/I/51nIO5Ej6jL._SX340_BO1,204,203,200_.jpg','Python for Probability, Statistics, and Machine Learning','Unpingco, Jose','This book covers the key ideas that link probability, statistics, and machine learning illustrated using Python modules in these areas.  The entire text, including all the figures and numerical results, is reproducible using the Python codes and their associated Jupyter/IPython notebooks, which are provided as supplementary downloads. The author develops key intuitions in machine learning by working meaningful examples using multiple analytical methods and Python codes, thereby connecting theoretical concepts to concrete implementations. Modern Python modules like Pandas, Sympy, and Scikit-learn are applied to simulate and visualize important machine learning concepts like the bias/variance trade-off, cross-validation, and regularization. Many abstract mathematical ideas, such as convergence in probability theory, are developed and illustrated with numerical examples.  This book is suitable for anyone with an undergraduate-level exposure to probability, statistics, or machine learning and with rudimentary knowledge of Python programming.');
    book = new Book('https://images-na.ssl-images-amazon.com/images/I/81G6zQFA%2BZL.jpg','Practical Time Series Forecasting with R: A Hands-On Guide','Galit Shmueli, Kenneth C. Lichtendahl Jr','Practical Time Series Forecasting with R: A Hands-On Guide, Second Edition provides an applied approach to time-series forecasting. Forecasting is an essential component of predictive analytics. The book introduces popular forecasting methods and approaches used in a variety of business applications. The book offers clear explanations, practical examples, and end-of-chapter exercises and cases. Readers will learn to use forecasting methods using the free open-source R software to develop effective forecasting solutions that extract business value from time-series data.');
    book = new Book('https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/7506/9780750649957.jpg','Operations Management: Policy, Practice and Performance Improvement','Steve Brown, Kate Blackmon, Paul Cousins, Harvey Maylor',';Operations Management: policy, practices, performance improvement; is the latest state-of-the-art approach to operations management. It provides new cutting edge input into operations management theory and practice that cannot be found in any other text. Discussing both strategic and tactical inputs it combines and balances service and manufacturing operations. * Cutting edge techniques accompanied by brand new case studies * Challenges standard approaches * Comprehensive coverage of strategic supply management * Critical sample questions to aid discussion * Reading lists and articles to support learning * Additional lecturer support material This outstanding author team is from the Operations Management Group at the University of Bath. Their expertise and knowledge is apparent in the text, and they bring to it their original research and experience in the field of operations management. Key Features: Cutting edge techniques employed New case study material to support points in the text Critical sample questions to assist the learning process.');
        book = new Book('https://pictures.abebooks.com/isbn/9780750638098-us.jpg','Managing Operations','Bob Johnson','Managing Operations is a concise guide to the fundamentals of operations management. Using examples and case studies from public, private and voluntary sector organizations, this book will enable managers to develop their competency to an excellent standard in an industrial or commercial setting. As well as being very practically based, Managing Operations also provides the theory behind operations management. The book is based on the Management Charter Initiative;s Occupational Standards for Management NVQs and SVQs at level 4. It is particularly suitable for managers on the Certificate in Management, or Part 1 of the Diploma, especially those accredited by the IM and Edexcel. Managing Operations is part of the highly successful series of textbooks for managers which cover the knowledge and understanding required as part of any competency-based management programme. The books cover the three main levels of management: supervisory/first-line management (NVQ level 3), middle management (Certificate/NVQ level 4) and senior management (Diploma/NVQ level 5). Also included are titles which cover management issues in particular sectors, such as schools or the public sector, in more depth. You will find a full listing of other titles available at the front of this book. Bob Johnson is a freelance management consultant and trainer with extensive experience of the retail, service, government and voluntary sectors. He has managed operations in the sales, marketing, purchasing, training and consultancy functions.');
    book = new Book('https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/7506/9780750681988.jpg','Operations Management in Context','Frank Rowbotham, Les Galloway and Masoud Azhashemi','Operations Management in Context provides students with excellent grounding in the theory and practice of operations management and its role within organizations.Structured in a clear and logical manner, Operations Management in Context gradually leads newcomers to this subject through each topic area, highlighting key issues, and using practical case study material and examples to contextualize learning. Each chapter is structured logically and concludes with summary material to aid revision. Exercises and self-assessment questions are included to reinforce learning and maintain variety, with answers included at the end of the book.');
}
