/* Shows a visible message if anything fails, so the page is never silently blank. */
window.addEventListener('error',function(e){
  var a=document.getElementById('app');
  if(!a||a.querySelector('.top'))return;
  var d=document.createElement('div');
  d.className='boot';
  d.textContent='Something went wrong while starting the portal: '+(e&&e.message?e.message:'unknown error');
  a.innerHTML='';
  a.appendChild(d);
});

(function(){
'use strict';

/* ---------- question builders ----------
   M: multiple choice (right answer first, shuffled at run time)
   T: true or false
   X: select all that apply (right answers first, shuffled at run time)
   O: put items in the correct order (listed in the correct order, shuffled at run time) */
var M=function(q,right,wrong,e){return {t:'mcq',q:q,o:[right].concat(wrong),a:[0],e:e};};
var X=function(q,right,wrong,e){return {t:'multi',q:q,o:right.concat(wrong),a:right.map(function(_,i){return i;}),e:e};};
var T=function(q,ans,e){return {t:'tf',q:q,o:['True','False'],a:[ans?0:1],e:e};};
var O=function(q,items,e){return {t:'order',q:q,items:items,e:e};};

/* ---------- CSC 406: Artificial Intelligence ---------- */
var AI=[
M(`Who defined AI in 1956 as the science and engineering of making intelligent machines?`,`John McCarthy`,[`Alan Turing`,`Marvin Minsky`,`Claude Shannon`],`McCarthy gave this definition in 1956, the year of the Dartmouth Conference where the term "Artificial Intelligence" was first used officially.`),
M(`Which formula summarises what AI needs, according to the course?`,`AI = Algorithm + Data + Computing Power`,[`AI = Hardware + Software + Network`,`AI = Logic + Rules + Memory`,`AI = Data + Storage + Cloud`],`The core formula is AI = Algorithm + Data + Computing Power. Better algorithms, far more data and stronger hardware (especially GPUs) drove the deep learning boom.`),
M(`Russell and Norvig view AI as the design of what?`,`Rational agents`,[`Expert databases`,`Neural hardware`,`Logic compilers`],`In their definition, AI is the design of rational agents that perceive the environment through sensors, reason, and act through actuators to achieve the best outcome.`),
M(`In which year did Alan Turing propose the Turing Test?`,`1950`,[`1943`,`1956`,`1966`],`Turing proposed it in 1950 in "Computing Machinery and Intelligence", where he asked "Can machines think?". It was the first formal idea that machine intelligence could be measured.`),
M(`Where and when was the term "Artificial Intelligence" first officially used?`,`The Dartmouth Conference, 1956`,[`Turing's 1950 paper`,`The MIT AI Lab, 1966`,`The MYCIN project at Stanford, 1970s`],`The Dartmouth Conference (McCarthy, Minsky, Rochester and Shannon) in 1956 marked the birth of AI as an academic field.`),
M(`Which expert system, built at Stanford, diagnosed bacterial infections?`,`MYCIN`,[`DENDRAL`,`XCON`,`CLIPS`],`MYCIN diagnosed bacterial infections and recommended treatments. DENDRAL analysed chemical structures, XCON configured computers and CLIPS is NASA's rule-based system.`),
T(`DENDRAL is an expert system used for chemical analysis of molecular structures.`,true,`True. DENDRAL analysed molecular structures. MYCIN was the medical one.`),
M(`Which milestone happened in 2012 and reduced image recognition error rates dramatically?`,`AlexNet`,[`IBM Watson`,`AlphaGo`,`MYCIN`],`AlexNet (2012) revolutionised image recognition. Watson won Jeopardy! in 2011 and AlphaGo beat a world Go champion in 2016.`),
M(`AI that does one specific task very well but has no general reasoning ability is called:`,`Weak (Narrow) AI`,[`Strong AI`,`Reactive hardware`,`Fuzzy AI`],`Weak or Narrow AI is specialised. Strong AI aims to perform any intellectual task a human can.`),
M(`What does Strong AI aim to do?`,`Perform any intellectual task a human can do`,[`Perform one specific task efficiently`,`Store large rule bases only`,`Replace databases`],`Strong AI targets general human-level ability, while Weak AI is limited to specific tasks.`),
M(`Which agent type acts only on the current percept and ignores history, like a thermostat?`,`Simple reflex agent`,[`Model-based reflex agent`,`Goal-based agent`,`Utility-based agent`],`A simple reflex agent reacts to "now". A thermostat turns the heater on when the temperature is below a set point.`),
M(`A robot vacuum maps the room so it does not clean the same spot twice. Which agent type is it?`,`Model-based reflex agent`,[`Simple reflex agent`,`Goal-based agent`,`Utility-based agent`],`It keeps track of part of the world's state (the map), which is what makes it model-based.`),
M(`A GPS that selects a route to reach your destination is which agent type?`,`Goal-based agent`,[`Simple reflex agent`,`Model-based reflex agent`,`Utility-based agent`],`Goal-based agents act to achieve a specific goal, here reaching the destination.`),
M(`Which agent chooses actions to maximise happiness or satisfaction, not just reach a goal?`,`Utility-based agent`,[`Goal-based agent`,`Simple reflex agent`,`Model-based reflex agent`],`Utility-based agents weigh how good an outcome is. Example: a music recommender that also tries to surprise you with new favourites.`),
X(`Select the four agent types taught in the course.`,[`Simple reflex`,`Model-based reflex`,`Goal-based`,`Utility-based`],[`Reactive`,`Hybrid`],`The four agent types are simple reflex, model-based reflex, goal-based and utility-based. Reactive, deliberative and hybrid are agent architectures.`),
M(`An agent that reacts first and then reasons after confirming the situation uses which architecture?`,`Hybrid`,[`Reactive`,`Deliberative`,`Utility-based`],`Hybrid architectures combine reactive speed with deliberative planning: jump first, then run after confirming it is a snake.`),
M(`Which environment is fully observable?`,`Chess`,[`Driving in fog`,`Poker with hidden cards`,`A football match`],`In chess the agent can see everything relevant. Driving in fog is partially observable.`),
M(`Rolling a dice is an example of which type of environment?`,`Stochastic`,[`Deterministic`,`Static`,`Discrete and deterministic`],`In a stochastic environment the next state is partly random. Solving a math problem is deterministic.`),
M(`A football match is an example of which environment type?`,`Dynamic`,[`Static`,`Deterministic`,`Fully observable`],`A dynamic environment changes while the agent is deciding. A crossword puzzle is static.`),
M(`Controlling a robot arm is an example of which environment type?`,`Continuous`,[`Discrete`,`Static`,`Deterministic`],`Continuous environments have infinitely many possible states. A board game is discrete.`),
M(`Which is NOT one of the five components of a well-defined search problem?`,`Neural weights`,[`Initial state`,`Transition model`,`Path cost`],`The five components are initial state, actions, transition model, goal test (goal state) and path cost.`),
M(`Which search explores all nodes at one depth before going deeper?`,`Breadth-First Search (BFS)`,[`Depth-First Search (DFS)`,`Greedy Best-First Search`,`Uniform-Cost Search`],`BFS expands level by level and guarantees the shortest solution when every step costs the same.`),
M(`Which search follows one path as deep as possible and then backtracks?`,`Depth-First Search (DFS)`,[`Breadth-First Search (BFS)`,`A* Search`,`Uniform-Cost Search`],`DFS may find a solution faster, but not always the best one. Think of following one cave tunnel to the end.`),
M(`Which uninformed search expands the cheapest node first?`,`Uniform-Cost Search (UCS)`,[`Breadth-First Search`,`Depth-First Search`,`Greedy Best-First Search`],`UCS is useful when path costs differ, like choosing the cheapest flights first.`),
M(`What is the evaluation function of Greedy Best-First Search?`,`f(n) = h(n)`,[`f(n) = g(n) + h(n)`,`f(n) = g(n)`,`f(n) = g(n) - h(n)`],`GBFS uses only the heuristic. That makes it fast but not optimal.`),
M(`What is the evaluation function of A* search?`,`f(n) = g(n) + h(n)`,[`f(n) = h(n)`,`f(n) = g(n) x h(n)`,`f(n) = g(n)`],`A* adds the path cost so far, g(n), to the heuristic estimate, h(n).`),
T(`A* search guarantees the shortest path only if the heuristic is admissible.`,true,`True. An admissible heuristic never overestimates the true cost to the goal.`),
T(`Greedy Best-First Search always finds the optimal path.`,false,`False. GBFS is not optimal. It can get stuck in loops or take suboptimal paths.`),
M(`A heuristic is best described as:`,`An estimate of how close a state is to the goal`,[`The exact cost of the shortest path`,`A rule that stops the search`,`A list of visited nodes`],`Good heuristics drastically reduce search time, for example "move towards the tallest building you can see".`),
M(`"Paris is the capital of France" is which type of knowledge?`,`Declarative knowledge`,[`Procedural knowledge`,`Meta-knowledge`,`Heuristic knowledge`],`Declarative knowledge is facts about the world. Procedural knowledge is how to do things, such as steps to bake a cake.`),
M(`Knowing which recipe book has the best cake recipe is an example of:`,`Meta-knowledge`,[`Declarative knowledge`,`Procedural knowledge`,`Heuristic knowledge`],`Meta-knowledge is knowledge about knowledge.`),
M(`Which KR approach represents concepts as nodes and relationships as labelled edges?`,`Semantic networks`,[`Frames`,`Production rules`,`Ontologies`],`For example a "Cat" node connected to "Animal" with an "is-a" link.`),
M(`Which KR approach uses slots and values to represent a typical situation, such as a Restaurant with Menu and Waiter?`,`Frames`,[`Semantic networks`,`Production rules`,`Conceptual graphs`],`Frames are like a template you fill in when you enter a new situation.`),
M(`"IF the traffic light is red THEN stop" is an example of:`,`A production rule`,[`A semantic network`,`A frame`,`An ontology`],`Production rules are condition-action (IF ... THEN) rules.`),
M(`All humans are mortal, Socrates is human, so Socrates is mortal. This is which kind of reasoning?`,`Deductive`,[`Inductive`,`Abductive`,`Heuristic`],`Deductive reasoning goes from general rules to a specific conclusion.`),
M(`Every swan you have seen is white, so you conclude all swans are white. This is:`,`Inductive reasoning`,[`Deductive reasoning`,`Abductive reasoning`,`Forward chaining`],`Inductive reasoning draws a general rule from specific examples.`),
M(`The ground is wet, so you guess it rained. This is:`,`Abductive reasoning`,[`Deductive reasoning`,`Inductive reasoning`,`Backward chaining`],`Abductive reasoning finds the most likely explanation.`),
M(`Forward chaining is:`,`Data-driven, starting from known facts`,[`Goal-driven, starting from a target`,`Random, starting from any rule`,`Cost-driven, starting from the cheapest rule`],`Forward chaining starts with facts and applies rules to derive new conclusions, like diagnosing from symptoms.`),
T(`Backward chaining starts with the known facts and applies rules to derive conclusions.`,false,`False. Backward chaining is goal-driven: it starts with a goal and works backward to check supporting facts.`),
X(`Select the three components of an expert system.`,[`Knowledge base`,`Inference engine`,`User interface`],[`Actuator`,`Activation function`],`An expert system has a knowledge base, an inference engine and a user interface. Actuators belong to agents and robots, activation functions to neural networks.`),
M(`Which is the Bayes theorem formula used in Naive Bayes?`,`P(A|B) = P(B|A) x P(A) / P(B)`,[`P(A|B) = P(A) x P(B) / P(B|A)`,`P(A|B) = P(A) + P(B|A)`,`P(A|B) = P(B) / P(A)`],`The posterior equals the likelihood times the prior, divided by the evidence.`),
M(`Given P(Spam) = 0.2, P(Win|Spam) = 0.7 and P(Win) = 0.22, what is P(Spam|Win)?`,`About 0.64`,[`1.4`,`0.14`,`0.22`],`P(Spam|Win) = (0.7 x 0.2) / 0.22 = 0.14 / 0.22, which is about 0.64. A probability can never be above 1, so 1.4 is always a sign of a mistake.`),
M(`Which type of learning uses labelled input-output pairs?`,`Supervised learning`,[`Unsupervised learning`,`Reinforcement learning`,`Transfer-free learning`],`Supervised learning maps inputs to known outputs, like learning with a teacher. It covers classification and regression.`),
M(`Grouping customers into segments without labels is an example of:`,`Unsupervised learning`,[`Supervised learning`,`Reinforcement learning`,`Overfitting`],`Unsupervised learning finds hidden patterns or groups in unlabelled data.`),
M(`A robot learning to walk by trial and error with rewards and penalties uses:`,`Reinforcement learning`,[`Supervised learning`,`Unsupervised learning`,`Backpropagation only`],`Reinforcement learning learns from rewards and penalties while interacting with an environment.`),
M(`Overfitting occurs when a model:`,`Memorises training noise and fails on new data`,[`Is too simple to capture the pattern`,`Has no training data`,`Uses too few features and scales them`],`It is like memorising answers without understanding. Underfitting is the opposite problem: a model too simple for the pattern.`),
M(`Why do we call scaler.transform (not fit_transform) on the test set?`,`To avoid data leakage`,[`To make training faster`,`To remove missing values`,`To increase the test size`],`The scaler must learn its parameters from the training data only. Fitting on test data would leak information.`),
M(`What does train_test_split(X, y, test_size=0.2, random_state=42) do?`,`Splits 80% for training and 20% for testing, reproducibly`,[`Splits 20% for training and 80% for testing`,`Splits 50/50 and shuffles every run`,`Scales the features`],`test_size=0.2 means 20% test data. random_state=42 makes the split repeatable.`),
M(`What does the ReLU activation function output?`,`Zero for negative inputs and the input itself for positive inputs`,[`A value between 0 and 1`,`A value between -1 and 1`,`Always the square of the input`],`Sigmoid outputs between 0 and 1, tanh between -1 and 1, and ReLU is zero for negatives.`),
M(`In a neural network, what is backpropagation?`,`Sending the error backward to adjust the weights`,[`Moving data from the output to the input layer for storage`,`Removing neurons from hidden layers`,`Scaling the input features`],`The prediction is compared with the correct answer using a loss function and the error adjusts the weights, like adjusting your aim after a dart throw.`),
M(`Which network type is specialised for image processing?`,`Convolutional Neural Network (CNN)`,[`Recurrent Neural Network (RNN)`,`Feedforward network only`,`Perceptron-free network`],`CNNs scan images piece by piece. RNNs handle sequential data like text and speech.`),
M(`Reducing "better" to "good" using vocabulary and grammar is called:`,`Lemmatization`,[`Stemming`,`Tokenization`,`Stop-word removal`],`Lemmatization uses vocabulary and grammar. Stemming just cuts words to a root, such as "running" to "run".`),
O(`Put the 8 steps of the NLP pipeline in order.`,[`Data collection`,`Text cleaning`,`Pre-processing`,`Feature extraction`,`Modelling`,`Evaluation`,`Deployment`,`Retraining`],`Data collection, text cleaning, pre-processing (tokenization, stop words, stemming or lemmatization), feature extraction (BoW, TF-IDF, Word2Vec), modelling, evaluation, deployment, retraining.`),
M(`In the Zipf's law analysis, rank and frequency are plotted on:`,`Log-log scales`,[`Linear scales`,`A pie chart`,`A confusion matrix`],`On log-log axes, a Zipfian distribution is roughly a straight line, and its slope gives the exponent s.`),
M(`Which smoothing did the n-gram models use in the assignment?`,`Laplace (add-1) smoothing`,[`Good-Turing smoothing`,`Kneser-Ney smoothing`,`No smoothing`],`Add-1 smoothing stops unseen n-grams from getting zero probability.`),
M(`Perplexity is used in the assignment to:`,`Evaluate the language model on a blind test set`,[`Clean the corpus`,`Scrape sentences`,`Count stop-words`],`Lower perplexity means the model is less surprised by unseen text.`),
M(`Which robot component acts as the robot's muscles?`,`Actuators`,[`Sensors`,`Controller`,`Power supply`],`Sensors are the eyes, ears and skin. The controller is the brain.`),
M(`Which branch of AI focuses on visual comprehension?`,`Computer Vision`,[`Natural Language Processing`,`Expert systems`,`Fuzzy logic`],`Computer vision lets machines interpret images and video.`),
M(`Which logic allows degrees of truth between 0 and 1?`,`Fuzzy logic`,[`Propositional logic`,`Predicate logic`,`Boolean logic`],`Propositional and Boolean logic are strictly true or false.`),
M(`What is the name of your group's working branch in the Indigenous NLP assignment?`,`group-05-gbagyi`,[`group-05-nupe`,`main`,`group-gbagyi-05`],`Branches follow group-XX-language, and Group 5 is on the Gbagyi track (Groups 5 to 8).`)
];

/* ---------- CSC 404: Network Design and Management ---------- */
var NET=[
M(`What is a transmission medium?`,`The physical pathway through which data travels from sender to receiver`,[`The software that encrypts data`,`The device that assigns IP addresses`,`The protocol that routes packets`],`It is the communication channel that forms the backbone of every network and determines speed, distance, security and cost.`),
M(`What are the two classes of transmission media?`,`Guided and unguided`,[`Physical and logical`,`Wired and encrypted`,`Analog and digital`],`Guided (wired) media use a physical conductor. Unguided (wireless) media use air, vacuum or free space.`),
X(`Select the unguided (wireless) media.`,[`Radio waves`,`Microwaves`,`Satellite`],[`Coaxial cable`,`Twisted pair`],`Unguided media include radio waves, microwaves, satellite, infrared and Wi-Fi. Coaxial and twisted pair are guided.`),
M(`Which guided medium is immune to electromagnetic interference and has the highest bandwidth?`,`Fibre optic cable`,[`Twisted pair cable`,`Coaxial cable`,`Radio waves`],`Fibre uses light signals, giving very high bandwidth and immunity to electromagnetic interference.`),
M(`Which is the cheapest guided medium, common in LAN cabling?`,`Twisted pair`,[`Fibre optic`,`Satellite`,`Microwave`],`Twisted pair (UTP/STP) is the cheapest and most common for LAN cabling.`),
M(`What is network topology?`,`The physical or logical arrangement of nodes and communication links`,[`The speed of a network link`,`The set of protocols a network uses`,`The security policy of a network`],`It defines how computers, switches and routers are interconnected and how data flows.`),
M(`What are the two types of topology?`,`Physical and logical`,[`Star and bus`,`Guided and unguided`,`Wired and wireless`],`Physical topology is the layout of devices and cables. Logical topology is the path data packets actually follow.`),
M(`In a star topology, how are hosts connected?`,`Each to a central device such as a switch or hub`,[`In a single shared cable`,`In a closed loop`,`Every host to every other host`],`Point-to-point links to a central device give centralised management and easy troubleshooting.`),
T(`Logical topology describes the physical layout of cables and devices.`,false,`False. That is physical topology. Logical topology describes how data packets flow from node to node, regardless of the physical connections (for example logical bus or token ring).`),
M(`How many phases are in the Network Development Life Cycle (NDLC) used in the course?`,`Six`,[`Four`,`Five`,`Seven`],`The six phases: requirements analysis and planning, network design, implementation, testing and validation, operations and management, optimization and maintenance.`),
O(`Put the six phases of the Network Development Life Cycle in order.`,[`Requirements analysis and planning`,`Network design`,`Network implementation`,`Testing and validation`,`Network operations and management`,`Optimization and maintenance`],`Learn them in this order. Each phase feeds the next, and optimization loops back into new requirements.`),
M(`Which phase identifies organisational goals, user capacity, workloads and constraints before any hardware is bought?`,`Requirements analysis and planning`,[`Network design`,`Network implementation`,`Testing and validation`],`This initial stage defines the technical specifications.`),
M(`Which phase translates requirements into physical and logical blueprints, including IP schemes, routing and device layout?`,`Network design`,[`Requirements analysis and planning`,`Network implementation`,`Optimization and maintenance`],`Network design produces the blueprints that implementation then builds.`),
M(`Which phase systematically evaluates connectivity, security, performance and failover before release?`,`Testing and validation`,[`Network implementation`,`Network operations and management`,`Network design`],`It happens before the network goes into production.`),
M(`Continuous monitoring, user administration, fault management and device maintenance belong to which phase?`,`Network operations and management`,[`Network implementation`,`Testing and validation`,`Network design`],`This is the day-to-day running of the network.`),
M(`Which of these is NOT a major activity of the implementation phase?`,`Gathering organisational goals and user capacity`,[`Hardware procurement`,`Cable installation`,`Documentation`],`Gathering goals belongs to requirements analysis. Implementation activities are hardware procurement, cable installation, configuration, device deployment, software installation and documentation.`),
X(`Select the activities of the network implementation phase.`,[`Hardware procurement`,`Cable installation`,`Configuration`,`Device deployment`,`Software installation`,`Documentation`],[`Requirements elicitation`,`Capacity auditing`],`All six are implementation activities. Requirements elicitation belongs to phase one.`),
M(`Setting IP addresses, passwords, VLANs and security rules is which implementation activity?`,`Configuration`,[`Device deployment`,`Documentation`,`Hardware procurement`],`Configuration means programming the network settings of devices.`),
M(`Recording topology diagrams, IP allocation tables, device inventories and configuration backups is:`,`Documentation`,[`Configuration`,`Software installation`,`Cable installation`],`Documentation is the last implementation activity and supports future maintenance.`),
M(`Mounting, positioning and physically placing network hardware in designated locations is:`,`Device deployment`,[`Hardware procurement`,`Configuration`,`Software installation`],`Device deployment is the physical placement of the equipment.`),
M(`Deploying network operating systems, firmware updates, security software and monitoring tools is:`,`Software installation`,[`Configuration`,`Documentation`,`Device deployment`],`Software installation covers everything from firmware to monitoring tools.`),
M(`Which benefit of optimization and maintenance uses preventive maintenance, backup devices and regular updates?`,`Reducing downtime`,[`Supporting growth`,`Reducing operational costs`,`Improving performance only`],`Reducing downtime keeps services available and minimises interruptions.`),
M(`Which benefit ensures the network can handle new devices, users and bandwidth demands without a full redesign?`,`Supporting growth`,[`Reducing downtime`,`Increasing security`,`Enhancing reliability`],`Scalability is the key idea behind supporting organisational growth.`),
T(`Server consolidation, cloud integration and bandwidth optimization can reduce operational costs.`,true,`True. They lower maintenance expenses and power usage.`),
M(`What is Quality of Service (QoS)?`,`Techniques used to prioritise high-priority, latency-sensitive traffic over non-critical streams`,[`A cabling standard for fibre`,`A method of assigning IP addresses`,`A firewall rule set`],`QoS makes sure traffic such as voice and video gets the performance it needs.`),
X(`Select the kinds of traffic QoS would prioritise.`,[`Voice over IP`,`Video conferencing`,`Online exams`],[`Background downloads`,`Casual web browsing`],`Real-time traffic is latency-sensitive. Downloads and browsing are delay-tolerant.`),
M(`Latency and jitter reduction in QoS helps to:`,`Keep audio and video streaming smooth`,[`Increase cable length`,`Encrypt packets`,`Assign addresses`],`Jitter is variation in packet arrival time, which breaks real-time audio and video.`),
M(`Which techniques does QoS use to prevent packet loss during heavy use?`,`Bandwidth allocation and traffic shaping`,[`Cable labelling`,`Password policies`,`Device mounting`],`These guarantee minimum bandwidth and smooth traffic bursts.`),
M(`Service management is best defined as:`,`Planning, organising, delivering, monitoring and improving services to meet user needs`,[`Installing network hardware`,`Writing network documentation`,`Assigning IP addresses`],`It covers the whole service life, from planning through continual improvement.`),
M(`FCAPS is a network management framework developed by which body?`,`The International Organization for Standardization (ISO)`,[`IEEE`,`Cisco`,`The IETF`],`FCAPS is an internationally recognised ISO framework for managing computer networks.`),
M(`What does the F in FCAPS stand for, and what does it do?`,`Fault management: detects and corrects network problems`,[`Firewall management: filters traffic`,`Flow management: measures bandwidth`,`Fibre management: tests cables`],`Fault management detects, isolates and corrects problems.`),
M(`Which FCAPS area manages network device settings?`,`Configuration management`,[`Accounting management`,`Performance management`,`Fault management`],`C is configuration management.`),
M(`Which FCAPS area tracks network resource usage?`,`Accounting management`,[`Configuration management`,`Security management`,`Performance management`],`A is accounting management.`),
M(`Which FCAPS area monitors network efficiency?`,`Performance management`,[`Fault management`,`Security management`,`Accounting management`],`P is performance management.`),
M(`Which FCAPS area protects network resources and data?`,`Security management`,[`Fault management`,`Configuration management`,`Accounting management`],`S is security management.`),
O(`Put the FCAPS areas in order.`,[`Fault management`,`Configuration management`,`Accounting management`,`Performance management`,`Security management`],`F, C, A, P, S. Memory trick: Fix, Configure, Account, Perform, Secure.`)
];

/* ---------- CSC 410: Software Project Management ---------- */
var SPM=[
M(`What is a software project?`,`A temporary, systematic endeavour to create or modify a software system`,[`A permanent team that maintains software`,`A tool for tracking bugs`,`A document listing requirements`],`Temporary means it has a start and an end. The aim is to create or modify a software system.`),
M(`What is a software project management system (SPMS)?`,`A digital platform that helps development teams plan, track and execute software projects`,[`A compiler for project code`,`A database of software licences`,`A hardware monitoring tool`],`Examples include Jira, Trello and GitHub Projects.`),
X(`Select the three key pillars of an SPMS.`,[`Iterative lifecycle management`,`Requirements and bug tracking`,`Technical resource and risk allocation`],[`Marketing automation`,`Payroll processing`],`The three pillars are iterative lifecycle management, requirements and bug tracking, and technical resource and risk allocation.`),
M(`Which of these is NOT a project management tool?`,`Wireshark`,[`Jira`,`Asana`,`Smartsheet`],`Wireshark is a network packet analyser. The ten tools in the course are Jira, Trello, Asana, Microsoft Project, Monday.com, ClickUp, Basecamp, Smartsheet, Wrike and GitHub Projects.`),
M(`What does an SPMS add over a general PMS?`,`Bug and issue tracking, Agile sprint boards and version control integration`,[`Gantt charts and budgets`,`Resource allocation only`,`Scheduling only`],`A general PMS is built for any industry and covers tasks, resources, scheduling (Gantt charts) and budgets. An SPMS is built for software and adds the software-specific features.`),
M(`A task that must be started or completed before another dependent task can begin is a:`,`Predecessor task`,[`Successor task`,`Milestone`,`Constraint`],`The dependent task that waits for it is the successor task.`),
M(`A dependent task that cannot begin or finish until its predecessor is completed is a:`,`Successor task`,[`Predecessor task`,`Milestone`,`Resource`],`Successors depend on predecessors.`),
M(`A limitation on a project, such as time, cost or scope, that dictates start or finish dates is a:`,`Constraint`,[`Milestone`,`Predecessor`,`Risk`],`Constraints restrict what a project can do and when.`),
M(`A marker with zero duration that signifies a major event or phase completion is a:`,`Milestone`,[`Constraint`,`Successor task`,`Activity`],`Milestones have no duration. They show achievement in the schedule.`),
M(`What are the three major project constraints?`,`Scope, time and cost`,[`Scope, quality and staff`,`Time, risk and cost`,`Cost, tools and scope`],`Scope is what must be done, time is the schedule available and cost is the budget limit. Quality is sometimes added as a fourth.`),
M(`In the triple constraint, "scope" means:`,`What must be done`,[`The schedule available`,`The budget limit`,`The people available`],`Time is the schedule, cost is the budget.`),
T(`Changing one of the three major constraints usually forces a change in the others.`,true,`True. That is why they are called the triple constraint.`),
M(`Which is a benefit of effective software project management?`,`It prevents project runaways and provides a clear roadmap`,[`It removes the need for requirements`,`It guarantees zero risk`,`It replaces the development team`],`Effective SPM assures success, prevents projects from spiralling out of control in cost or time, and gives a roadmap.`),
M(`Risk management is:`,`The systematic process of identifying, analysing and monitoring project risks`,[`Allocating resources to tasks`,`Writing the requirements document`,`Tracking project costs only`],`It is a continuing process throughout the project.`),
M(`Which of these is a common project risk?`,`Poor time and cost estimates`,[`Too many milestones`,`A clear roadmap`,`Early documentation`],`Others include changing scope, unclear requirements, staff turnover, technology problems and poor communication.`),
M(`Resource management is:`,`Identifying and allocating scarce resources to specific tasks`,[`Identifying risks`,`Setting project milestones`,`Gathering requirements`],`Its effect on SPM: a task cannot proceed until its assigned resource is available.`),
M(`How does resource management affect software project management?`,`A task cannot proceed until its assigned resource is available`,[`It removes the need for a schedule`,`It sets the project budget`,`It defines the project scope`],`Resource availability directly controls when tasks can start.`),
M(`The project manager is the driving force of the:`,`Managerial control loop`,[`Compiler pipeline`,`Version control system`,`Network protocol stack`],`The loop is: plan, monitor progress, compare against the plan, take corrective action.`),
O(`Put the managerial control loop in order.`,[`Plan`,`Monitor progress`,`Compare against the plan`,`Take corrective action`],`The project manager keeps this loop running throughout the project.`),
M(`What are the three primary responsibility categories of a project manager?`,`Interpersonal, informational and decisional`,[`Technical, financial and legal`,`Planning, coding and testing`,`Scope, time and cost`],`These come from Mintzberg's managerial roles.`),
M(`Monitor, disseminator and spokesperson are which category of project manager roles?`,`Informational`,[`Interpersonal`,`Decisional`,`Technical`],`Interpersonal roles are figurehead, leader and liaison. Decisional roles include entrepreneur, disturbance handler, resource allocator and negotiator.`),
M(`Resource allocator and negotiator are which category of project manager roles?`,`Decisional`,[`Interpersonal`,`Informational`,`Technical`],`Decisional roles are about making the decisions that keep the project moving.`),
M(`Figurehead, leader and liaison are which category of project manager roles?`,`Interpersonal`,[`Informational`,`Decisional`,`Financial`],`Interpersonal roles are about leading the team and building links with others.`),
M(`Why is progress hard to measure in software projects?`,`The product is intangible`,[`The product is always small`,`There are no requirements`,`Teams never use tools`],`Software cannot be seen or touched, so progress is easy to misreport.`),
X(`Select the characteristics that make software projects different from other projects.`,[`Intangible product`,`High complexity`,`Easy to change, so requirements shift`,`Hard to estimate`],[`High per-copy manufacturing cost`,`Fixed requirements throughout`],`Software is intangible, complex, changeable, volatile in requirements and hard to estimate. The cost is in design, not in copying.`),
M(`What is the purpose of a project management plan?`,`To state how the project will be executed, monitored and controlled`,[`To store the source code`,`To replace the requirements document`,`To list only the team members`],`It also defines scope, schedule, budget, roles, risks and communication, and gives a baseline to measure progress against.`),
X(`Select the typical contents of a project management plan.`,[`Scope statement`,`Work breakdown structure (WBS)`,`Schedule and budget`,`Risk plan`],[`Source code listing`,`Hardware serial numbers`],`A plan also includes a resource plan, communication plan, quality plan and change control process.`),
M(`Requirements gathering is:`,`Discovering, collecting, documenting and agreeing on what stakeholders need the software to do`,[`Writing the final code`,`Testing the finished software`,`Estimating the budget only`],`Poor requirements are one of the biggest causes of project failure.`),
M(`The document that records requirements is usually called the:`,`Software Requirements Specification (SRS)`,[`Software Resource Schedule`,`System Risk Summary`,`Source Review Sheet`],`The SRS is the main output of requirements gathering.`),
M(`Which is an example of a non-functional requirement?`,`The system must respond within two seconds`,[`The system must let users register`,`The system must print receipts`,`The system must show a menu`],`Functional requirements say what the system does. Non-functional ones say how well, such as speed, security and usability.`),
M(`Which is NOT a common requirements gathering technique?`,`Compiling the source code`,[`Interviews`,`Prototyping`,`Questionnaires`],`Other techniques are observation, workshops, studying documents, use cases and user stories.`),
O(`Put the steps of requirements gathering in order.`,[`Identify the stakeholders`,`Elicit their needs`,`Analyse and resolve conflicts`,`Document the requirements`,`Validate with stakeholders`,`Manage changes`],`Identify, elicit, analyse, document (SRS), validate, then manage changes as the project continues.`),
O(`Put the steps of risk management in order.`,[`Identify what could go wrong`,`Analyse likelihood and impact`,`Plan a response`,`Monitor the risks`],`Responses are: avoid, reduce, transfer or accept.`),
M(`Buying insurance or outsourcing to cover a risk is which response?`,`Transfer`,[`Avoid`,`Reduce`,`Accept`],`The four responses are avoid, reduce, transfer and accept.`),
M(`Uncontrolled addition of new features without adjusting time or cost is called:`,`Scope creep`,[`Risk transfer`,`Milestone slippage`,`Resource levelling`],`Scope creep is a classic cause of late and over-budget projects.`),
M(`Which action helps a project manager deliver on time?`,`Reviewing every change request for its time and cost impact`,[`Accepting all changes immediately`,`Skipping status meetings`,`Removing all milestones`],`Other actions: realistic planning with a WBS, tracking progress, managing risks early, prioritising critical tasks, adding buffer time and delivering in iterations.`)
];

/* ---------- CSC 402: Finite Automata ---------- */
var FA=[
M(`What is a Deterministic Finite Automaton (DFA)?`,`A finite-state machine with exactly one possible next state for every state and input symbol`,[`A machine that may have several next states for one input`,`A machine with no final states`,`A machine that reads its own output`],`"Deterministic" means exactly one transition for each state and symbol.`),
M(`What is the formal 5-tuple of a DFA?`,`(Q, Σ, δ, q0, F)`,[`(Q, δ, q0, F, S)`,`(S, Σ, T, q0, G)`,`(Q, Σ, δ, F, ε)`],`Q is the set of states, Σ the alphabet, δ the transition function, q0 the start state and F the set of final states.`),
M(`In the DFA 5-tuple, what does Q represent?`,`The finite set of states`,[`The input alphabet`,`The set of final states`,`The transition function`],`Σ is the alphabet and F is the set of final (accepting) states.`),
M(`What is the transition function of a DFA?`,`δ: Q × Σ → Q`,[`δ: Q × Σ → 2^Q`,`δ: Q → Σ`,`δ: Σ → F`],`Each state and symbol maps to exactly one state.`),
M(`What is the transition function of an NFA?`,`δ: Q × Σ → 2^Q`,[`δ: Q × Σ → Q`,`δ: Q → F`,`δ: Σ × Σ → Q`],`An NFA maps to a set of states, which can be empty, one state or many.`),
M(`How does an NFA differ from a DFA?`,`For a state and symbol an NFA can have zero, one or many transitions`,[`An NFA has no start state`,`An NFA accepts more languages`,`An NFA cannot have final states`],`Both recognise the same class of languages, the regular languages.`),
T(`An NFA can recognise languages that no DFA can recognise.`,false,`False. Every NFA can be converted to an equivalent DFA, so both recognise exactly the regular languages.`),
T(`A DFA may have ε-transitions.`,false,`False. ε-transitions belong to ε-NFAs. A DFA reads exactly one symbol per move.`),
T(`In an NFA, a state may have no transition at all on a given symbol.`,true,`True. That path simply dies for that input.`),
M(`In the DFA for "an even number of 0s" over {0,1}, which state is the start and accepting state?`,`q0, meaning an even number of 0s so far`,[`q1, meaning an odd number of 0s so far`,`Both q0 and q1`,`Neither`],`q0 is start and accepting. Reading 0 flips between q0 and q1, and reading 1 stays in the same state.`),
M(`In that even-0s DFA, what happens when you read 1 in state q1?`,`It stays in q1`,[`It moves to q0`,`The machine rejects immediately`,`It moves to a dead state`],`Both states loop on 1.`),
M(`Is 10100 accepted by the DFA for an even number of 0s?`,`No, it has three 0s`,[`Yes, it has three 0s`,`Yes, it has two 0s`,`No, it contains a 1`],`Three is odd, so it ends in q1, which is not accepting.`),
M(`Is 0110 accepted by the DFA for an even number of 0s?`,`Yes, it has two 0s`,[`No, it has two 0s`,`No, it has one 0`,`Yes, it has three 0s`],`Two is even, so it ends in q0.`),
M(`What is an ε-transition?`,`A move between states without reading any input symbol`,[`A move that reads two symbols`,`A transition to a dead state`,`A transition that erases the stack`],`Written δ(q, ε) = p. An ordinary transition δ(q, a) = p reads symbol a.`),
M(`The ε-closure of a state is:`,`The state itself plus every state reachable using only ε-transitions`,[`Only the states reachable on the symbol a`,`The set of final states`,`The set of dead states`],`It always includes the state itself.`),
M(`In the ε-NFA q0 --ε--> q1 --a--> q2 --b--> q3 (with q0 looping on a,b), what is the ε-closure of q0?`,`{q0, q1}`,[`{q0}`,`{q1}`,`{q0, q1, q2, q3}`],`From q0, the only ε-move leads to q1. The ε-closure of q1, q2 and q3 are {q1}, {q2} and {q3}.`),
M(`In the NFA for strings ending in "ab" (q0 loops on a,b; q0 --a--> q1 --b--> q2), is "baab" accepted?`,`Yes, the final set contains q2`,[`No, it ends in q1`,`No, it ends in q0 only`,`Yes, because it starts with b`],`Tracing: {q0}, b gives {q0}, a gives {q0,q1}, a gives {q0,q1}, b gives {q0,q2}. q2 is accepting.`),
M(`Is "abb" accepted by the same NFA for strings ending in "ab"?`,`No`,[`Yes`,`Only if it starts with a`,`Yes, because it contains ab`],`After "ab" the set is {q0,q2}. The final b leaves only {q0}, which is not accepting.`),
M(`What is the first step of the subset construction?`,`Start with the set containing only the NFA start state`,[`List all final states`,`Remove all ε-transitions`,`Sort the alphabet`],`For the example NFA this gives {q0}.`),
O(`Put the steps of the subset construction in order.`,[`Start with the set containing the NFA start state`,`For each set and symbol, take the union of the NFA moves`,`Repeat until no new sets appear`,`Mark any set containing an NFA final state as final`],`This turns an NFA into an equivalent DFA.`),
M(`In subset construction, when is a DFA state final?`,`When its set contains an NFA final state`,[`When its set contains the NFA start state`,`When its set has exactly one state`,`When its set is empty`],`In the example, {q0,q2} and {q0,q1,q2} are final because they contain q2.`),
M(`NFA: q0 on 0 goes to {q0,q1}, on 1 to {q0}; q1 on 1 goes to {q2}; q2 loops on 0,1. From {q0,q1}, where does input 1 lead?`,`{q0, q2}`,[`{q0, q1}`,`{q2}`,`{q0}`],`q0 on 1 gives {q0} and q1 on 1 gives {q2}. The union is {q0, q2}.`),
M(`Using the same NFA, from {q0,q1} on input 0 the DFA goes to:`,`{q0, q1}`,[`{q0, q2}`,`{q0}`,`{q0, q1, q2}`],`q0 on 0 gives {q0,q1} and q1 on 0 gives nothing.`),
M(`What language does the subset-construction DFA in the example accept?`,`Strings that contain the substring 01`,[`Strings that end in 10`,`Strings with an even number of 0s`,`Strings that start with 1`],`The machine reaches a final set once it has seen a 0 followed by a 1, and stays final-capable afterwards.`),
M(`Is 001 accepted by the example DFA?`,`Yes`,[`No`,`Only with a trailing 0`,`Only if it starts with 1`],`{q0}, 0 gives {q0,q1}, 0 gives {q0,q1}, 1 gives {q0,q2}, which is final.`),
M(`Is 0101 accepted by the example DFA?`,`Yes`,[`No`,`Only if it has an even number of 0s`,`Only if it ends in 0`],`It ends in {q0,q2}, which is final.`),
M(`Is 111 accepted by the example DFA?`,`No`,[`Yes`,`Yes, because it ends in 1`,`Only after a 0`],`It never leaves {q0}, which is not final.`),
M(`What is the first partition (0-equivalence) in DFA minimization?`,`Final states in one group and non-final states in the other`,[`States sorted by name`,`States with the same transitions`,`Reachable and unreachable states`],`For the example this gives {q0,q1,q3,q4,q5,q6,q7} and {q2}.`),
O(`Put the minimization steps in order.`,[`0-equivalence: split final from non-final`,`1-equivalence: group by where each symbol leads`,`2-equivalence: split states that go to different groups`,`Stop when the groups no longer change`],`Keep refining until k-equivalence equals (k+1)-equivalence.`),
M(`In the 8-state minimization example, which pair of states is equivalent?`,`q1 and q7`,[`q2 and q0`,`q6 and q0`,`q3 and q4`],`The final equivalent groups are {q0,q4}, {q6}, {q1,q7}, {q3,q5} and {q2}.`),
M(`How many states does the minimum DFA in the example have?`,`5`,[`3`,`4`,`8`],`The 8 states merge into 5 groups.`),
M(`In the minimized DFA, what is the final state?`,`{q2}`,[`{q0, q4}`,`{q6}`,`{q3, q5}`],`q2 was the only final state, and it stays alone in its group.`),
M(`In the minimized DFA, what is the start state?`,`{q0, q4}`,[`{q6}`,`{q1, q7}`,`{q2}`],`The group containing the original start state q0.`),
M(`Why is q6 separated from q0 and q4 in 2-equivalence?`,`It goes to different groups on the same inputs`,[`It is a final state`,`It has no transitions`,`It is unreachable`],`q6 goes to groups that q0 and q4 do not go to, so it behaves differently.`)
];

/* ---------- CSC 408: Modelling and Simulation ---------- */
var SIM=[
M(`What is the one-line idea of simulation?`,`Disciplined "lying" to a computer so it tells you the truth about the real world`,[`Solving a system with exact formulas`,`Measuring a real system directly`,`Drawing a diagram of a system`],`You build a fake version of a system, run it, and study the result to learn about the real one.`),
M(`What is a system?`,`A collection of entities that interact towards a common purpose`,[`A computer program that imitates reality`,`A statistical distribution`,`A list of random numbers`],`Examples: a hospital, a bank, a factory line.`),
M(`What is a model?`,`A physical, mathematical or computational representation of a system built to study it`,[`The real system itself`,`A set of results`,`A project report`],`A model is built for a purpose, which is studying a system.`),
M(`What is a simulation?`,`An imitation of a system's operation over time by generating and observing an artificial history`,[`A formula that gives the exact answer`,`A real experiment on the actual system`,`A table of measurements`],`The artificial history is generated and then observed.`),
M(`What is a simulation study?`,`The complete project from defining the problem to implementing validated recommendations`,[`Running the model once`,`Writing the code only`,`Collecting data only`],`It covers the whole process, not just the program.`),
M(`Simulation models are __________, while analytical models are __________.`,`run, solved`,[`solved, run`,`built, tested`,`measured, drawn`],`A simulation model is executed and observed. An analytical model is solved with formulas.`),
M(`Who said "Essentially, all models are wrong, but some are useful"?`,`George Box`,[`Claude Shannon`,`Albert Einstein`,`Pritsker`],`Judge a model by usefulness, not by truth.`),
M(`What did Shannon (1975) warn about modelling?`,`The tendency is nearly always to simulate too much detail rather than too little`,[`Models never need detail`,`Simulation is always cheaper than measurement`,`Models should copy reality exactly`],`Design the model around the question to be answered.`),
M(`Moving knowledge from an expert's head into explicit written rules is done through:`,`Elicitation`,[`Formalisation`,`Translation`,`Verification`],`Elicitation uses interviews, observation and walkthroughs.`),
O(`Put the expert knowledge conversion pipeline in order.`,[`Tacit knowledge`,`Explicit knowledge`,`Conceptual model`,`Executable model`],`Elicitation turns tacit into explicit, formalisation into a conceptual model, and translation into an executable model.`),
M(`The Delphi method is:`,`A panel of experts converging on an answer over rounds`,[`A time-motion study`,`A statistical test`,`A programming language`],`It is one of the techniques for expert knowledge conversion.`),
M(`What is the classic failure when converting expert knowledge?`,`The analyst assumes instead of asking`,[`The expert refuses to talk`,`The model runs too fast`,`The data is too clean`],`Every silent assumption becomes a bug you cannot see later.`),
M(`Which way of studying a system fails when the system does not exist yet?`,`Measurement`,[`Simulation`,`Mathematical analysis`,`Simulation and analysis`],`Measurement also fails when changes are too expensive or the system is unavailable.`),
M(`Mathematical analysis fails when:`,`The system is too complex for closed-form solutions`,[`The system does not exist`,`Data is plentiful`,`The system is small`],`That describes almost all real systems, which is why simulation is used.`),
M(`A static simulation model shows the system:`,`At a single point in time`,[`Over a period of time`,`With random variables only`,`With continuous change`],`Dynamic models show the system over time.`),
M(`A deterministic model:`,`Has no random variables, so the same input gives the same output`,[`Has random variables`,`Changes at random events only`,`Cannot be run`],`Stochastic models have randomness and give different results each run.`),
M(`A stochastic model:`,`Has random variables, so results change each run`,[`Always gives identical results`,`Has no state variables`,`Only runs once`],`Because outputs are random, you need statistics such as means and confidence intervals.`),
M(`In a discrete model, state changes:`,`Only at separate points in time`,[`Continuously and non-stop`,`Never`,`Only at the end`],`In a continuous model, state changes continuously.`),
X(`Select the four major simulation paradigms.`,[`Monte Carlo`,`Agent-based modelling`,`Discrete event simulation`,`System dynamics`],[`Linear regression`,`Backpropagation`],`The four paradigms are Monte Carlo, agent-based modelling, discrete event simulation and system dynamics.`),
M(`Estimating pi by throwing random points into a unit square is a classic demo of:`,`Monte Carlo simulation`,[`System dynamics`,`Agent-based modelling`,`Discrete event simulation`],`Count how many points land inside the quarter circle. It was first used at scale in 1944 on the Manhattan Project.`),
M(`In agent-based modelling, global behaviour:`,`Emerges from local interaction between autonomous agents`,[`Is programmed directly`,`Is solved by differential equations`,`Is fixed in advance`],`Used for crowds, epidemics, markets and traffic.`),
M(`System dynamics models use:`,`Stocks, flows and feedback loops expressed as differential equations`,[`Queues and events only`,`Individual agents`,`Random sampling`],`Used for policy, population, economy and supply chains.`),
M(`The predator and prey model dx/dt = r*x - a*x*y is an example of:`,`System dynamics`,[`Monte Carlo`,`Discrete event simulation`,`Agent-based modelling`],`It is expressed as differential equations.`),
M(`Discrete event simulation is used for:`,`Queues, logistics, networks and manufacturing`,[`Population policy`,`Estimating pi`,`Crowd emergence`],`Entities flow through the system and the state changes only at events.`),
M(`In the seven building blocks, an entity is:`,`An object of interest in the system`,[`A property of an object`,`An instantaneous occurrence`,`A period of time`],`An attribute is a property of an entity.`),
M(`An event is:`,`An instantaneous occurrence that may change the state of the system`,[`A time period of specified length`,`A property of an entity`,`The collection of variables describing the system`],`An activity is a time period of specified length.`),
M(`Which building block is the collection of variables needed to describe the system at any time?`,`State variable`,[`Attribute`,`Activity`,`Event`],`The state variables describe the system at a point in time.`),
M(`Activities and events in the environment that affect the system from outside are:`,`Exogenous`,[`Endogenous`,`Static`,`Deterministic`],`Endogenous activities and events occur inside the system.`),
M(`Which Pritsker principle says the problem statement controls the modelling effort?`,`The problem statement is the primary controlling element`,[`The secret of a good modeller is to avoid remodelling`,`Models should be evaluated as good or bad`,`The purpose of modelling is to produce models`],`The purpose of modelling is knowledge and understanding, not models, and models are judged by usefulness.`),
M(`In the Cynefin framing, high staff turnover is an example of which domain?`,`Complex`,[`Simple`,`Complicated`,`Chaotic`],`Complex means not fully knowable or controllable: explore, probe, sense and adapt.`),
M(`In which Cynefin domain does simulation earn its keep?`,`Complex`,[`Simple`,`Chaotic`,`Complicated only`],`Where you cannot solve a problem but you can explore it.`),
M(`In the chaotic domain you should:`,`Act, sense and improvise`,[`Analyse and deduce`,`Follow standard procedures`,`Probe and adapt slowly`],`A flooded office is the example.`),
M(`When is simulation NOT appropriate?`,`When the problem can be solved mathematically in closed form`,[`When the system is complex`,`When internal interactions matter`,`When animation helps explain a plan`],`Also not appropriate when common sense solves it, direct experiment is cheaper, there is no input data, or the model cannot be verified.`),
M(`Which question does verification ask?`,`Am I building the thing right?`,[`Am I building the right thing?`,`Is the budget enough?`,`Is the model animated?`],`Verification checks software correctness.`),
M(`Which question does validation ask?`,`Am I building the right thing?`,[`Am I building the thing right?`,`Is the code fast?`,`Is the data large?`],`Validation checks that the model represents reality.`),
O(`Put the 12 steps of a simulation study in order.`,[`Problem formulation`,`Setting objectives and project plan`,`Model conceptualisation`,`Data collection`,`Model translation`,`Verified?`,`Validated?`,`Experimental design`,`Production runs and analysis`,`More runs?`,`Documentation and reporting`,`Implementation`],`Steps 3 and 4 run in parallel. If the model is not verified, go back to model translation. If it is not validated, go back to conceptualisation and data.`),
M(`If the model is not verified (step 6), you go back to:`,`Model translation (step 5)`,[`Problem formulation`,`Implementation`,`Experimental design`],`Verification problems are coding problems, so you fix the translation.`),
M(`What are the two kinds of documentation?`,`Program documentation and progress documentation`,[`User manual and licence`,`Design and test reports`,`Internal and external`],`Program documentation explains how the program works. Progress documentation records the chronology, decisions and assumptions.`),
M(`Output analysis of a stochastic simulation should use:`,`Means, variances, confidence intervals and hypothesis tests`,[`One run and a guess`,`The maximum value only`,`Visual inspection of one number`],`Outputs are random variables, so a single number is not enough.`),
M(`In the Excel market lab, which function gives the average waiting time for rows with 1 cashier?`,`AVERAGEIF`,[`AVERAGE`,`CORREL`,`COUNTIF`],`=AVERAGEIF('Raw Dataset'!C2:C11,1,'Raw Dataset'!F2:F11) averages waiting time only where cashiers = 1.`),
M(`In the market lab data, what is the average waiting time with 1 cashier compared with 2 cashiers?`,`About 16.1 minutes and 11.5 minutes`,[`About 11.5 minutes and 16.1 minutes`,`About 13.8 minutes for both`,`About 29 minutes and 16 minutes`],`Hours 1, 2, 3, 7 and 10 had one cashier (average 16.12). Hours 4, 5, 6, 8 and 9 had two (average 11.5).`),
M(`Adding a second cashier in the lab reduced average waiting time by about:`,`29%`,[`11%`,`41%`,`50%`],`(16.12 - 11.5) / 16.12 is about 28.7%, so roughly 29%.`),
M(`In the market lab data, what is the total number of lost customers?`,`19`,[`21`,`13`,`3`],`3 + 2 + 0 + 2 + 3 + 0 + 3 + 1 + 2 + 3 = 19.`),
M(`In the market lab data, what is the maximum queue length?`,`8`,[`5`,`4`,`51`],`The maximum queue length of 8 happened in Hour 7.`),
M(`What does CORREL between customers arrived and waiting time show in the lab data?`,`A weak positive correlation, about 0.17`,[`A strong positive correlation, about 0.9`,`A moderate negative correlation`,`No data`],`Waiting time depends more on service time and the number of cashiers than on arrivals alone.`),
M(`Why is the market queue lab a discrete event simulation?`,`The system state changes only at arrival and service events`,[`The state changes continuously`,`It uses differential equations`,`It uses no random variables`],`State changes happen only at discrete arrival and service points.`)
];

/* ---------- course registry ---------- */
var COURSES=[
 {id:'ai',code:'CSC 406',name:'Artificial Intelligence',color:'#1D4ED8',qs:AI,focus:'Lecture notes, search, knowledge representation, ML, NLP and the Gbagyi assignment.'},
 {id:'net',code:'CSC 404',name:'Network Design and Management',color:'#0F766E',qs:NET,focus:'Transmission media, topology, life cycle, implementation, QoS and FCAPS.'},
 {id:'sim',code:'CSC 408',name:'Modelling and Simulation',color:'#BE123C',qs:SIM,focus:'Definitions, paradigms, building blocks, the 12 steps and the market lab.'},
 {id:'fa',code:'CSC 402',name:'Finite Automata',color:'#B45309',qs:FA,focus:'DFA, NFA, ε-NFA, subset construction and minimization. Redo the tables on paper too.'},
 {id:'spm',code:'CSC 410',name:'Software Project Management',color:'#7C3AED',qs:SPM,focus:'SPMS, terms, constraints, risk, requirements gathering and PM roles.'}
];
COURSES.forEach(function(c){c.qs.forEach(function(q,i){q.id=c.id+'-'+i;q.course=c.id;});});
var BYID={}, BYCOURSE={};
COURSES.forEach(function(c){BYCOURSE[c.id]=c;c.qs.forEach(function(q){BYID[q.id]=q;});});
var TOTALQ=COURSES.reduce(function(n,c){return n+c.qs.length;},0);

/* ---------- storage ---------- */
var KEY='examPortal.v1';
var store={stats:{},missed:{},plan:{},theme:'auto'};
function load(){try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);store.stats=o.stats||{};store.missed=o.missed||{};store.plan=o.plan||{};store.theme=o.theme||'auto';}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}

/* ---------- helpers ---------- */
function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function fmt(ms){ms=Math.max(0,ms);var s=Math.ceil(ms/1000),m=Math.floor(s/60);s=s%60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
function toast(msg){var t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove();},2200);}
function applyTheme(){document.documentElement.setAttribute('data-theme',store.theme);}
function allMissedIds(){var out=[];Object.keys(store.missed).forEach(function(k){(store.missed[k]||[]).forEach(function(id){if(BYID[id])out.push(id);});});return out;}
function missedCount(cid){return (store.missed[cid]||[]).filter(function(id){return BYID[id];}).length;}
var TYPE_LABEL={mcq:'Multiple choice',tf:'True or false',multi:'Select all that apply',order:'Put in order'};

/* ---------- dashboard ---------- */
var PLAN=[
 {d:1,id:'ai',t:'CSC 406 Artificial Intelligence',s:'The biggest course. Take the quiz, then read the explanations you missed.'},
 {d:2,id:'net',t:'CSC 404 Network Design and Management',s:'Memorise the six phases and FCAPS, then quiz.'},
 {d:3,id:'sim',t:'CSC 408 Modelling and Simulation',s:'Know the 12 steps in order and the four paradigms.'},
 {d:4,id:'fa',t:'CSC 402 Finite Automata',s:'Quiz first, then redo one subset construction and one minimization on paper.'},
 {d:5,id:'spm',t:'CSC 410 Software Project Management',s:'Definitions, constraints, risk and requirements gathering.'},
 {d:6,id:'mixed',t:'Mixed mock exam',s:'Questions from all five courses in one timed run.'},
 {d:7,id:'missed',t:'Missed questions, then a final mixed run',s:'Clear your missed bank, then finish with a mixed exam.'}
];

function renderDashboard(){
  var best=[],attempted=0;
  COURSES.forEach(function(c){var s=store.stats[c.id];if(s&&s.attempts){attempted++;best.push(s.best);}});
  var avg=attempted?Math.round(best.reduce(function(a,b){return a+b;},0)/COURSES.length):0;
  var miss=allMissedIds().length;
  var days=PLAN.filter(function(p){return store.plan['d'+p.d];}).length;
  var h='';
  h+='<div class="top"><div><h1>Exam prep portal</h1><p class="sub">Five 400 level courses, '+TOTALQ+' practice questions. Pick a course, take a timed quiz, and read the explanation after every answer.</p></div>';
  h+='<button class="ghost" data-act="theme" aria-label="Change theme">Theme: '+({auto:'Auto',light:'Light',dark:'Dark'})[store.theme]+'</button></div>';
  h+='<section class="ready" aria-label="Overall readiness"><div class="big">'+avg+'%</div><div class="txt"><b>Overall readiness</b><span>'+(attempted?'Average of your best scores across all five courses.':'Take a quiz in each course to build this score.')+' '+attempted+' of 5 courses attempted, '+miss+' missed questions waiting.</span><div class="bar"><i style="width:'+avg+'%"></i></div></div></section>';
  h+='<h2 class="sec">Courses</h2>';
  COURSES.forEach(function(c){
    var s=store.stats[c.id]||{attempts:0,best:0,last:0};
    var m=missedCount(c.id);
    h+='<article class="course" style="--c:'+c.color+'"><div class="stripe"></div><div class="body">';
    h+='<div class="head"><span class="chip">'+c.code+'</span><h3>'+esc(c.name)+'</h3></div>';
    h+='<div class="meta">'+c.qs.length+' questions. '+esc(c.focus)+'</div>';
    h+='<div class="mastery"><div class="bar"><i style="width:'+s.best+'%"></i></div><span class="pct">'+(s.attempts?('Best '+s.best+'%'):'Not started')+'</span></div>';
    h+='<div class="btns"><button class="btn primary" data-act="setup" data-id="'+c.id+'">Start quiz</button>';
    if(m)h+='<button class="btn" data-act="setup-missed" data-id="'+c.id+'">Retry missed ('+m+')</button>';
    h+='</div></div></article>';
  });
  h+='<article class="course" style="--c:#475569"><div class="stripe"></div><div class="body"><div class="head"><span class="chip">All</span><h3>Mixed mock exam</h3></div><div class="meta">Random questions from all five courses, like a full revision session.</div><div class="btns"><button class="btn primary" data-act="setup" data-id="mixed">Start mixed exam</button>';
  if(miss)h+='<button class="btn" data-act="setup" data-id="missed">Practise all missed ('+miss+')</button>';
  h+='</div></div></article>';
  h+='<h2 class="sec">7-day plan</h2><details class="plan"'+(days<7?' open':'')+'><summary>Your week <small>'+days+' of 7 days done</small></summary>';
  PLAN.forEach(function(p){
    var done=!!store.plan['d'+p.d];
    h+='<div class="day'+(done?' done':'')+'"><input type="checkbox" data-act="plan" data-d="'+p.d+'" '+(done?'checked':'')+' aria-label="Mark day '+p.d+' done"><div class="d"><b>Day '+p.d+': '+esc(p.t)+'</b><span>'+esc(p.s)+'</span></div><button class="btn" data-act="setup" data-id="'+p.id+'">Start</button></div>';
  });
  h+='</details>';
  h+='<p class="foot">Progress is saved on this device only. Questions come from the CSC 406, 404, 410, 402 and 408 study posts.</p>';
  $('app').innerHTML=h;
}

/* ---------- overlay ---------- */
var cfg={id:'ai',count:20,perQ:45,shuffle:true,missedOnly:false};
var S=null;

function showOverlay(){$('overlay').classList.add('open');document.body.style.overflow='hidden';}
function hideOverlay(){$('overlay').classList.remove('open');document.body.style.overflow='';}
function setSheet(html){$('sheet').innerHTML=html;}

function poolFor(id,missedOnly){
  var list;
  if(id==='mixed')list=COURSES.reduce(function(a,c){return a.concat(c.qs);},[]);
  else if(id==='missed')list=allMissedIds().map(function(i){return BYID[i];});
  else list=BYCOURSE[id].qs;
  if(missedOnly&&id!=='missed'){var m={};allMissedIds().forEach(function(i){m[i]=1;});list=list.filter(function(q){return m[q.id];});}
  return list;
}
function titleFor(id){
  if(id==='mixed')return 'Mixed mock exam';
  if(id==='missed')return 'Missed questions';
  return BYCOURSE[id].code+': '+BYCOURSE[id].name;
}

function openSetup(id,missedOnly){
  var pool=poolFor(id,false);
  if(!pool.length){toast('No questions here yet.');return;}
  cfg.id=id;cfg.shuffle=true;cfg.perQ=45;cfg.missedOnly=!!missedOnly;
  var n=poolFor(id,cfg.missedOnly).length;
  cfg.count=id==='mixed'?Math.min(30,n):Math.min(20,n);
  renderSetup();showOverlay();
}
function renderSetup(){
  var pool=poolFor(cfg.id,cfg.missedOnly),n=pool.length;
  var opts=[10,20,30,50].filter(function(x){return x<n;});
  var h='<div class="sheet-in"><h2>'+esc(titleFor(cfg.id))+'</h2><p class="lead">Set up your session. You get instant feedback and an explanation after every answer.</p>';
  h+='<div class="field"><span class="lab">Number of questions</span><div class="seg" role="group" aria-label="Number of questions">';
  opts.forEach(function(x){h+='<button data-act="count" data-v="'+x+'" aria-pressed="'+(cfg.count===x)+'">'+x+'</button>';});
  h+='<button data-act="count" data-v="all" aria-pressed="'+(cfg.count==='all'||cfg.count>=n)+'">All ('+n+')</button></div></div>';
  h+='<div class="field"><span class="lab">Time per question</span><div class="seg" role="group" aria-label="Time per question">';
  [[30,'30 seconds'],[45,'45 seconds'],[60,'60 seconds'],[0,'Untimed']].forEach(function(p){h+='<button data-act="perq" data-v="'+p[0]+'" aria-pressed="'+(cfg.perQ===p[0])+'">'+p[1]+'</button>';});
  h+='</div></div>';
  h+='<label class="check"><input type="checkbox" data-act="shuffle" '+(cfg.shuffle?'checked':'')+'> Shuffle question order</label>';
  if(cfg.id!=='missed'&&poolFor(cfg.id,true).length)h+='<label class="check"><input type="checkbox" data-act="missedonly" '+(cfg.missedOnly?'checked':'')+'> Only questions I missed before ('+poolFor(cfg.id,true).length+')</label>';
  var cnt=(cfg.count==='all'||cfg.count>=n)?n:cfg.count;
  h+='<div class="summary"><b>'+cnt+' questions</b>'+(cfg.perQ?(', <b>'+fmt(cnt*cfg.perQ*1000)+'</b> total time. The exam ends automatically when time runs out.'):', no time limit. The clock counts up.')+'</div>';
  h+='<button class="btn primary block" data-act="start">Start exam</button><div style="height:10px"></div><button class="btn block" data-act="close">Back to dashboard</button></div>';
  setSheet(h);
}

/* ---------- quiz ---------- */
function prep(q){
  var c=BYCOURSE[q.course];
  var p={id:q.id,t:q.t,q:q.q,e:q.e,course:q.course,code:c.code,color:c.color};
  if(q.t==='order'){
    var sh;do{sh=shuffle(q.items);}while(q.items.length>1&&sh.join('|')===q.items.join('|'));
    p.pool=sh;p.correct=q.items.slice();
  }else if(q.t==='tf'){p.o=q.o.slice();p.ans=q.a.slice();}
  else{
    var perm=shuffle(q.o.map(function(_,i){return i;}));
    p.o=perm.map(function(i){return q.o[i];});
    p.ans=[];perm.forEach(function(orig,k){if(q.a.indexOf(orig)>-1)p.ans.push(k);});
  }
  return p;
}
function startQuiz(custom){
  var base;
  if(custom)base=custom;
  else{
    base=poolFor(cfg.id,cfg.missedOnly);
    base=cfg.shuffle?shuffle(base):base.slice();
    var n=(cfg.count==='all'||cfg.count>=base.length)?base.length:cfg.count;
    base=base.slice(0,n);
  }
  var list=base.map(prep),n2=list.length,now=Date.now();
  S={id:cfg.id,list:list,i:0,score:0,answers:[],perQ:cfg.perQ,total:cfg.perQ*n2,startedAt:now,
     deadline:cfg.perQ?now+cfg.perQ*n2*1000:0,locked:false,sel:[],seq:[],done:false,timerId:null,filter:'all'};
  setSheet('<div class="qbar"><button class="x" data-act="exit" aria-label="Exit exam">&times;</button><span class="ct" id="ct"></span><span class="sc" id="sc"></span><span class="sp"></span><span class="timer" id="timer" role="timer" aria-label="Time">00:00</span></div><div class="prog"><i id="prog"></i></div><div class="sheet-in" id="qbody"></div>');
  S.timerId=setInterval(tick,250);tick();
  renderQuestion();
}
function tick(){
  if(!S||S.done)return;
  var t=$('timer');if(!t)return;
  var ms;
  if(S.deadline){ms=S.deadline-Date.now();if(ms<=0){finish(true);return;}
    var frac=ms/(S.total*1000);
    t.className='timer'+((ms<30000||frac<.1)?' danger':(frac<.25?' warn':''));
  }else ms=Date.now()-S.startedAt;
  t.textContent=fmt(ms);
}
function updateBar(){
  var answered=S.answers.filter(Boolean).length;
  $('ct').textContent='Question '+(S.i+1)+' of '+S.list.length;
  $('sc').textContent='Score '+S.score+(answered?' of '+answered:'');
  $('prog').style.width=((S.i)/S.list.length*100)+'%';
}
function renderQuestion(){
  var q=S.list[S.i];S.locked=false;S.sel=[];S.seq=[];
  updateBar();
  var h='<div class="qmeta"><span class="chip" style="--c:'+q.color+'">'+q.code+'</span><span>'+TYPE_LABEL[q.t]+'</span></div>';
  h+='<h2 class="qtext">'+esc(q.q)+'</h2><div id="area"></div><div id="fb" role="status" aria-live="polite"></div><div class="actions" id="act"></div>';
  h+='<p class="hint" id="hint"></p>';
  $('qbody').innerHTML=h;$('qbody').scrollTop=0;
  if(q.t==='order')renderOrder();else renderOptions();
}
function renderOptions(){
  var q=S.list[S.i],h='<div class="opts">';
  q.o.forEach(function(o,k){h+='<button class="opt" data-act="opt" data-k="'+k+'"><span class="k">'+(k+1)+'</span><span>'+esc(o)+'</span></button>';});
  h+='</div>';$('area').innerHTML=h;
  if(q.t==='multi'){
    $('act').innerHTML='<button class="btn primary" data-act="check" id="chk" disabled>Check answer</button>';
    $('hint').textContent='Tap every correct option, then check your answer.';
  }else $('hint').textContent='Tap an answer. Keyboard: press 1 to '+q.o.length+'.';
}
function renderOrder(){
  var q=S.list[S.i],h='<ol class="slot">';
  for(var i=0;i<q.pool.length;i++){
    if(S.seq[i]!==undefined)h+='<li><button class="chipbtn" data-act="unplace" data-p="'+i+'">'+esc(q.pool[S.seq[i]])+'</button></li>';
    else h+='<li><div class="ph">'+(i===S.seq.length?'Tap the next item below':'')+'</div></li>';
  }
  h+='</ol><div class="pool"><span class="lab">Items</span>';
  q.pool.forEach(function(it,k){if(S.seq.indexOf(k)===-1)h+='<button data-act="place" data-k="'+k+'">'+esc(it)+'</button>';});
  h+='</div>';
  $('area').innerHTML=h;
  $('act').innerHTML='<button class="btn primary" data-act="check" id="chk" '+(S.seq.length===q.pool.length?'':'disabled')+'>Check order</button><button class="btn" data-act="reset">Reset</button>';
  $('hint').textContent='Tap items in the correct order. Tap a placed item to remove it.';
}
function pickOption(k){
  if(S.locked)return;var q=S.list[S.i];
  if(q.t==='multi'){
    var at=S.sel.indexOf(k);if(at>-1)S.sel.splice(at,1);else S.sel.push(k);
    var btns=document.querySelectorAll('.opt');
    btns.forEach(function(b,i){b.classList.toggle('sel',S.sel.indexOf(i)>-1);});
    $('chk').disabled=S.sel.length===0;
  }else{S.sel=[k];evaluate();}
}
function evaluate(){
  if(S.locked)return;S.locked=true;
  var q=S.list[S.i],ok,yours,right;
  if(q.t==='order'){
    var seqText=S.seq.map(function(k){return q.pool[k];});
    ok=seqText.join('|')===q.correct.join('|');yours=seqText.join(' > ');right=q.correct.join(' > ');
    var items=document.querySelectorAll('.chipbtn');
    items.forEach(function(b,i){b.disabled=true;b.classList.add(seqText[i]===q.correct[i]?'correct':'wrong');});
    document.querySelectorAll('.pool,#act .btn:not(#chk)').forEach(function(n){n.style.display='none';});
  }else{
    var sel=S.sel.slice().sort(),ans=q.ans.slice().sort();
    ok=sel.join(',')===ans.join(',');
    yours=sel.map(function(k){return q.o[k];}).join('; ');right=ans.map(function(k){return q.o[k];}).join('; ');
    document.querySelectorAll('.opt').forEach(function(b,i){
      var isAns=q.ans.indexOf(i)>-1,isSel=S.sel.indexOf(i)>-1;
      b.disabled=true;b.classList.remove('sel');
      if(isAns&&isSel)b.classList.add('correct');
      else if(isAns)b.classList.add(q.t==='multi'?'missed':'correct');
      else if(isSel)b.classList.add('wrong');
    });
  }
  if(ok)S.score++;
  S.answers[S.i]={ok:ok,yours:yours,right:right};
  var fb='<div class="fb '+(ok?'ok':'no')+'"><b class="t">'+(ok?'Correct':'Not quite')+'</b>';
  if(!ok)fb+='<p class="ans">Correct answer: '+esc(right)+'</p>';
  fb+='<p class="why">'+esc(q.e)+'</p></div>';
  $('fb').innerHTML=fb;
  var last=S.i===S.list.length-1;
  $('act').innerHTML='<button class="btn primary" data-act="next" id="nx">'+(last?'See results':'Next question')+'</button>';
  $('hint').textContent='Press Enter to continue.';
  updateBar();
  $('nx').focus({preventScroll:true});
  $('fb').scrollIntoView({block:'nearest',behavior:'smooth'});
}
function next(){
  if(S.i>=S.list.length-1){finish(false);return;}
  S.i++;renderQuestion();
}

/* ---------- finish, results, review ---------- */
function finish(timeUp){
  if(!S||S.done)return;
  S.done=true;clearInterval(S.timerId);
  var n=S.list.length,correct=S.score;
  var answered=S.answers.filter(Boolean).length;
  var pct=Math.round(correct/n*100);
  S.pct=pct;S.timeUp=!!timeUp;
  S.elapsed=Math.min(Date.now()-S.startedAt,S.deadline?S.total*1000:Infinity);
  /* save stats and missed bank */
  var st=store.stats[S.id]||{attempts:0,best:0,last:0};
  st.attempts++;st.last=pct;st.best=Math.max(st.best,pct);
  if(S.id!=='missed')store.stats[S.id]=st;
  else if(store.stats.missed)delete store.stats.missed;
  S.list.forEach(function(q,i){
    var a=S.answers[i];if(!a)return;
    var arr=store.missed[q.course]||[];var at=arr.indexOf(q.id);
    if(a.ok){if(at>-1)arr.splice(at,1);}else if(at===-1)arr.push(q.id);
    store.missed[q.course]=arr;
  });
  save();
  renderResults();
}
function grade(p){
  if(p>=80)return ['Exam ready','You know this material. Keep revising the questions you missed.'];
  if(p>=60)return ['Solid progress','Good base. Read the explanations for the misses and retry.'];
  if(p>=40)return ['Needs more work','Go back to the study post for the topics you missed, then retry.'];
  return ['Start with the basics','Read the course post again, then take the quiz untimed.'];
}
function renderResults(){
  var n=S.list.length,answered=S.answers.filter(Boolean).length,wrong=answered-S.score,skipped=n-answered;
  var g=grade(S.pct),C=2*Math.PI*54;
  var h='<div class="sheet-in"><h2>'+(S.timeUp?'Time is up':'Exam complete')+'</h2><p class="lead">'+esc(titleFor(S.id))+'</p>';
  h+='<div class="rs"><div class="ring"><svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true"><circle class="tr" cx="66" cy="66" r="54"></circle><circle class="fg" id="fg" cx="66" cy="66" r="54" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'"></circle></svg><div class="n">'+S.pct+'%</div></div>';
  h+='<div class="info"><h2>'+g[0]+'</h2><p class="lead" style="margin:0">'+g[1]+'</p><div class="stats"><div><b>'+S.score+' of '+n+'</b><span>Correct</span></div><div><b>'+wrong+'</b><span>Incorrect</span></div>'+(skipped?'<div><b>'+skipped+'</b><span>Unanswered</span></div>':'')+'<div><b>'+fmt(S.elapsed)+'</b><span>Time used</span></div></div></div></div>';
  h+='<div class="btns"><button class="btn primary" data-act="review">Review answers</button>';
  if(wrong+skipped>0)h+='<button class="btn" data-act="retry-wrong">Retry the '+(wrong+skipped)+' I missed</button>';
  h+='<button class="btn" data-act="retake">Retake</button><button class="btn" data-act="close">Dashboard</button></div></div>';
  setSheet(h);
  var fg=$('fg');if(fg){requestAnimationFrame(function(){requestAnimationFrame(function(){fg.style.strokeDashoffset=C*(1-S.pct/100);});});}
}
function renderReview(){
  var h='<div class="sheet-in"><h2>Review answers</h2><p class="lead">'+esc(titleFor(S.id))+', '+S.pct+'%</p>';
  h+='<div class="filters"><button class="ghost" data-act="filter" data-v="all" aria-pressed="'+(S.filter==='all')+'">All</button><button class="ghost" data-act="filter" data-v="wrong" aria-pressed="'+(S.filter==='wrong')+'">Missed only</button></div>';
  var shown=0;
  S.list.forEach(function(q,i){
    var a=S.answers[i];
    if(S.filter==='wrong'&&a&&a.ok)return;
    shown++;
    var cls=!a?'na':(a.ok?'ok':'no'),lab=!a?'Not answered':(a.ok?'Correct':'Incorrect');
    var right=a?a.right:(q.t==='order'?q.correct.join(' > '):q.ans.map(function(k){return q.o[k];}).join('; '));
    h+='<div class="rv"><div class="st '+cls+'">'+(i+1)+'. '+lab+'</div><div class="qq">'+esc(q.q)+'</div>';
    if(a)h+='<div class="ln"><span>Your answer:</span> '+esc(a.yours)+'</div>';
    h+='<div class="ln"><span>Correct answer:</span> '+esc(right)+'</div><div class="ex">'+esc(q.e)+'</div></div>';
  });
  if(!shown)h+='<p class="lead">Nothing missed here. Nice work.</p>';
  h+='<div class="btns"><button class="btn primary" data-act="back-results">Back to results</button><button class="btn" data-act="close">Dashboard</button></div></div>';
  setSheet(h);
}
function retryWrong(){
  var qs=[];
  S.list.forEach(function(q,i){var a=S.answers[i];if(!a||!a.ok)qs.push(BYID[q.id]);});
  if(!qs.length)return;
  cfg.id=S.id;cfg.perQ=S.perQ;startQuiz(qs);
}
function exitConfirm(){
  if($('confirm'))return;
  var d=document.createElement('div');d.className='confirm';d.id='confirm';
  d.innerHTML='<div class="box"><h3>Leave this exam?</h3><p>Your answers in this attempt will not be saved.</p><div class="btns"><button class="btn primary" data-act="stay">Keep going</button><button class="btn" data-act="leave">Leave exam</button></div></div>';
  $('sheet').appendChild(d);
}
function leave(){if(S){clearInterval(S.timerId);S.done=true;}closeAll();}
function closeAll(){hideOverlay();setSheet('');S=null;renderDashboard();}

/* ---------- events ---------- */
document.addEventListener('click',function(ev){
  var el=ev.target.closest('[data-act]');if(!el)return;
  var act=el.getAttribute('data-act'),id=el.getAttribute('data-id'),v=el.getAttribute('data-v');
  switch(act){
    case 'theme':store.theme=({auto:'light',light:'dark',dark:'auto'})[store.theme];save();applyTheme();renderDashboard();break;
    case 'plan':if(el.checked)store.plan['d'+el.getAttribute('data-d')]=true;else delete store.plan['d'+el.getAttribute('data-d')];save();renderDashboard();break;
    case 'setup':openSetup(id,false);break;
    case 'setup-missed':openSetup(id,true);break;
    case 'count':cfg.count=v==='all'?'all':parseInt(v,10);renderSetup();break;
    case 'perq':cfg.perQ=parseInt(v,10);renderSetup();break;
    case 'shuffle':cfg.shuffle=el.checked;break;
    case 'missedonly':cfg.missedOnly=el.checked;var n=poolFor(cfg.id,cfg.missedOnly).length;if(cfg.count!=='all'&&cfg.count>n)cfg.count=n;renderSetup();break;
    case 'start':startQuiz();break;
    case 'close':closeAll();break;
    case 'exit':exitConfirm();break;
    case 'stay':$('confirm').remove();break;
    case 'leave':leave();break;
    case 'opt':pickOption(parseInt(el.getAttribute('data-k'),10));break;
    case 'check':if(S&&!S.locked)evaluate();break;
    case 'next':next();break;
    case 'place':if(!S.locked){S.seq.push(parseInt(el.getAttribute('data-k'),10));renderOrder();}break;
    case 'unplace':if(!S.locked){var p=parseInt(el.getAttribute('data-p'),10);S.seq.splice(p,1);renderOrder();}break;
    case 'reset':if(!S.locked){S.seq=[];renderOrder();}break;
    case 'review':S.filter='all';renderReview();break;
    case 'filter':S.filter=v;renderReview();break;
    case 'back-results':renderResults();break;
    case 'retry-wrong':retryWrong();break;
    case 'retake':startQuiz();break;
  }
});
document.addEventListener('keydown',function(ev){
  if(!S||S.done||!$('overlay').classList.contains('open'))return;
  if($('confirm')){if(ev.key==='Escape')$('confirm').remove();return;}
  if(ev.key==='Escape'){exitConfirm();return;}
  var q=S.list[S.i];if(!q)return;
  if(ev.key==='Enter'){
    if(S.locked){next();ev.preventDefault();}
    else if((q.t==='multi'&&S.sel.length)||(q.t==='order'&&S.seq.length===q.pool.length)){evaluate();ev.preventDefault();}
    return;
  }
  if(q.t!=='order'&&!S.locked&&/^[1-9]$/.test(ev.key)){var k=parseInt(ev.key,10)-1;if(k<q.o.length)pickOption(k);}
});

load();applyTheme();renderDashboard();
})();
