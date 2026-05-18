**Neural** **network** **optimization** **strategies** **and** **the** **topography** **of** **the** **loss** **landscape**


Jianneng Yu [1] and Alexandre V. Morozov [1,] _[ ∗]_

1 _Department_ _of_ _Physics_ _&_ _Astronomy,_ _Rutgers,_ _The_ _State_ _University_ _of_ _New_ _Jersey,_
_136_ _Frelinghuysen_ _Rd.,_ _Piscataway,_ _NJ_ _08854,_ _U.S.A._


Neural networks are trained by optimizing multi-dimensional sets of fitting parameters on nonconvex loss landscapes. Low-loss regions of the landscapes correspond to the parameter sets that
perform well on the training data. A key issue in machine learning is the performance of trained
neural networks on previously unseen test data. Here, we investigate neural network training by
stochastic gradient descent (SGD)        - a non-convex global optimization algorithm which relies only
on the gradient of the objective function. We contrast SGD solutions with those obtained via a nonstochastic quasi-Newton method, which utilizes curvature information to determine step direction
and Golden Section Search to choose step size. We use several computational tools to investigate
neural network parameters obtained by these two optimization methods, including kernel Principal
Component Analysis and a novel, general-purpose algorithm for finding low-height paths between
pairs of points on loss or energy landscapes, FourierPathFinder. We find that the choice of the
optimizer profoundly affects the nature of the resulting solutions. SGD solutions tend to be separated
by lower barriers than quasi-Newton solutions, even if both sets of solutions are regularized by
early stopping to ensure adequate performance on test data. When allowed to fit extensively on
the training data, quasi-Newton solutions occupy deeper minima on the loss landscapes that are
not reached by SGD. These solutions are less generalizable to the test data however. Overall,
SGD explores smooth basins of attraction, while quasi-Newton optimization is capable of finding
deeper, more isolated minima that are more spread out in the parameter space. Our findings
help understand both the topography of the loss landscapes and the fundamental role of landscape
exploration strategies in creating robust, transferrable neural network models.

## **I Introduction**


The problem of finding maximum or minimum values of multi-dimensional functions with complex non-linear
structure arises in engineering, economic and financial forecasting, biological data analysis, molecular physics, robot
design, and numerous other scientific and technological settings. Notable examples include finding free energy minima
in computer simulations of protein folding [1, 2], converging to high-fitness states in evolving populations [3–5], and
minimizing loss functions in training neural networks [6, 7].
Modern optimization algorithms used in deep learning [8, 9] are powerful enough to drive neural network (NN)
training loss to very low values across a wide variety of NN architectures and training datasets. However, minimizing training error does not necessarily guarantee robust performance on unseen data [10]. One reason for this is
the possibility of overfitting in overparameterized deep NNs, which is typically mitigated by early stopping, weight
regularization, and other techniques [6, 7]. Some sets of trained NN parameters generalize well, while others, despite
achieving equally low training loss, fail to transfer, resulting in poor test accuracy [11]. This behavior underscores
a central challenge in deep learning: understanding why some models generalize while others do not, even if they
occupy low-loss regions of the training landscape.
A key open question in deep learning theory is how different training procedures influence the types of solutions
found and the relative positions of these solutions on the loss landscape; a related area of inquiry focuses on the loss
landscape topography and connectivity [12–14]. For highly non-linear systems such as neural networks, the loss surface
is thought to be composed of numerous basins of attraction connected by relatively flat valleys [14, 15]. Interestingly,
even linear interpolation between trained models can reveal key features of the loss landscape geometry, including
the topography of barriers and valleys between local minima [16]. Later work addressed loss landscape visualization
with a variety of computational tools, establishing a dependence of the loss landscape curvature around optimized
solutions on the training method used in the optimization [17].
It has been widely observed that stochastic gradient descent (SGD) with small batch sizes tends to converge to
flatter minima, which are often associated with better generalization performance [11, 14, 15]. In contrast, adaptive
methods like Adam [7, 18] and RMSProp [7, 19], though potentially faster in convergence and lower in training loss,


_∗_ [morozov@physics.rutgers.edu](mailto:morozov@physics.rutgers.edu)


2


frequently lead to sharper solutions that may generalize less effectively [20]. Other methods that rely on curvature
information can achieve even lower training loss, but are also known to converge to sharper minima [21]. These
observations prompt fundamental questions: do approaches that rely solely on the gradient information, such as
SGD, find solutions in the same broad region of parameter space, or do they produce qualitatively distinct minima
with varying generalization properties? Are there significant differences between solutions found by gradient vs.
quasi-Newton methods [8, 22] which rely on the curvature information? Addressing these questions is crucial for
understanding how optimization algorithms explore high-dimensional, non-convex loss landscapes which have to be
traversed in NN training.
Several studies have recently examined the structure of NN loss landscapes and diversity, connectivity, and generalizability of optimized solutions. For instance, the distribution of Hessian eigenvalues during training was found
to have significant variation across optimization strategies [23], suggesting that different methods may settle into
different types of low-loss regions. It was argued that the minima of the loss function are connected by low-height
paths [24, 25], consistent with high levels of connectivity and continuity on the loss landscapes. Furthermore, it
was demonstrated that loss landscapes in deep neural networks admit star-convex paths between initial states and
optimized solutions, allowing gradient-based methods such as SGD to avoid local kinetic traps [26]. Sets of optimized
solutions in overparameterized networks frequently form star domains, which are regions where any point can be
connected to a ‘central’ solution via low-loss paths [27].
In this work, we focus on the relative advantages and disadvantages of employing SGD, a widely used stochastic
gradient-based optimizer [7], versus an efficient quasi-Newton method, Limited-memory Broyden-Fletcher-GoldfarbShanno [8, 28–31], augmented with a Golden Section Search for determining the step size (L-BFGS-GSS). We find
that although both methods yield similar performance on test data when early stopping is employed for regularization,
the solutions found by the two optimizers are qualitatively different. The L-BFGS-GSS solutions are separated by
higher barriers and are more distant from one another in parameter space. L-BFGS-GSS optimization can lead to
very low training loss values compared to SGD, resulting in overfit, poorly generalizable solutions. In contrast, SGD
solutions are more generalizable, in agreement with previous studies [11, 14, 15]. To study SGD and L-BFGS-GSS
solutions sets, we develop a number of approaches aimed at their visualization in the context of the loss landscape
topography, including a novel algorithm for finding low-height paths connecting pairs of points on loss, energy, or
negative fitness landscapes, `FourierPathFinder` .

## **II Methods**


**A** **Neural** **Network** **Architectures**


We study the loss landscapes of four neural network (NN) architectures trained on the MNIST dataset of 28 _×_ 28
black-and-white images of handwritten digits [32]. The first NN we consider is a fully connected perceptron (FCP)

- a feedforward network with two hidden layers of 50 units each, which use ReLU activations and no bias terms.
The input layer has 784 nodes and receives _D_ = 28 _×_ 28 = 784 pixel values as inputs; the output layer is a `softmax`
classifier into 10 single-digit classes: 0 _. . ._ 9. The second NN is a convolutional neural network (CNN) [33] with LeNet
architecture [34]. It consists of two convolutional layers with 6 and 16 channels, respectively, each followed by average
pooling and ReLU activation. The two-layer convolutional block is followed by three fully connected layers with 120,
84, and 10 nodes; the last layer outputs probabilities of 10 single-digit classes.
The third NN is a Long Short-Term Memory (LSTM) recurrent network [35]. Following Ref. [36], each image is
flattened and permuted over all 784 pixels (with a fixed random seed for reproducibility), then reshaped into 28 time
steps of 28 features each for the sequential processing by the LSTM. The LSTM has a hidden layer size of 48 and
outputs the final hidden state to a linear classifier with 10 output units and no bias term. Finally, we employ a
shallow autoencoder architecture [37] to explore unsupervised loss landscapes. The encoder and decoder each consist
of two FC layers with 32 units per layer, `softplus` activations, and no biases; the final layer of the decoder uses
a sigmoid activation to reconstruct the image. Implementations of all four NN model architectures are available at
`https://github.com/jy856-jpg/path-finding` . The total number of fitting parameters for each NN, _N_ prm, is listed
in Table I.
For the three classification models, we define the loss function _⟨l_ ( _x_ [train] _, ω_ ) _⟩_ or _⟨l_ ( _x_ [test] _, ω_ ) _⟩_ as the cross-entropy
loss between the predicted output and the true label, averaged over the entire training or test set (except for SGD
optimization, where the averages are taken over 64 images in a mini-batch). For the autoencoder, _⟨l_ ( _x_ [train] _, ω_ ) _⟩_ or
_⟨l_ ( _x_ [test] _, ω_ ) _⟩_ is defined as the mean squared reconstruction error, also averaged over the entire training or test set.
Here, _ω_ denotes a vector of model-dependent weights and biases. We use a standard split of the MNIST dataset into
_{x_ [train] _}_ with _N_ = 5 _×_ 10 [4] training images and _{x_ [test] _}_ with _N_ = 10 [4] test images [32].


3


**B** **Quasi-Newton** **optimization** **with** **Golden** **Section** **Search**


Second-order optimization methods aim to improve convergence by incorporating curvature information [22, 38].
The function to be minimized is approximated locally using a second-order Taylor expansion:


_f_ ( _z_ + _ϵ_ ) _≈_ _f_ ( _z_ ) + _∇f_ ( _z_ ) _[T]_ _ϵ_ + [1] (1)

2 _[ϵ][T][ Hϵ,]_


where _f_ ( _z_ ) is a function of an _N_ -dimensional argument _z_, _∇f_ ( _z_ ) = _∇yf_ ( _y_ ) _|y_ = _z_ represents its gradient evaluated at _z_
( _∇y_ = _∂/∂y_ 1 _. . . ∂/∂yN_ ), and _H_ is the Hessian matrix of second derivatives: _Hij_ = _∂_ [2] _f_ ( _y_ ) _/∂yi∂yj|y_ = _z_ ( _i, j_ = 1 _. . . N_ ).
In the Newton-Raphson iterative optimization method, the update step is given by [22]:


_z_ [new] = _z_ [old] _−_ _H_ _[−]_ [1] _∇f_ ( _z_ ) _._ (2)


Note that both the direction and the magnitude of the minimization step are determined by the inverse of the
Hessian matrix – there is no need to choose the step size as in first-order optimization methods that rely solely on the
gradients [7]. However, computing and inverting the Hessian matrix scales poorly with the number of parameters [22,
39], which makes it infeasible to apply Eq. (2) to large models such as deep neural networks. To mitigate the high
computational cost of second-order methods, quasi-Newton algorithms such as Limited-memory Broyden-FletcherGoldfarb-Shanno (L-BFGS) [8, 28–31] are used to approximate the product between the inverse Hessian and the
gradient without explicitly computing and inverting the Hessian matrix. After computing the search direction _p_ =
_H_ _[−]_ [1] _∇f_ ( _z_ ), a line search is typically carried out to find the optimal step size, using Armijo-Wolfe conditions or other
suitable criteria [8, 40].
In the NN context, the goal is to optimize _f_ ( _ω_ ) = _⟨l_ ( _x, ω_ ) _⟩_, where _l_ ( _x, ω_ ) denotes the loss function corresponding
to the input datapoint _x_ (in our case, a single MNIST image) at the current set of weights _ω_, and the average is
taken over all images in the training dataset. Note that _N_ = _N_ prm in this case (cf. Table I). Here, we use the Golden
Section Search (GSS) [38] - a lightweight and derivative-free approach to line search. The goal of GSS, as in any line
search algorithm, is to find an optimal step size _u_ along the search direction _p_ by minimizing _f_ ( _u_ ) = _⟨l_ ( _x, ω −_ _up_ ) _⟩_,
where _f_ ( _u_ ) is now a 1D function. Briefly, GSS is used to find the minimum of a unimodal 1D function on a closed
interval by repeatedly shrinking a bracket that contain _√_ s the minimum. At each step, the interval is reduced by a
fixed fraction determined by the golden ratio _ϕ_ = (1 + 5) _/_ 2, allowing one function evaluation to be reused, so that

only a single new evaluation is needed per iteration. The algorithm converges robustly and linearly, with the error
decreasing by a constant factor at each iteration.
We call the L-BFGS algorithm augmented by GSS the L-BFGS-GSS optimizer, summarized in Algorithm 1. Note
that our customized implementation of the L-BFGS optimizer maintains two lists of size _m_, _s_ list and _y_ list, that contain
_m_ most recent differences _sk_ = _ωk −_ _ωk−_ 1 and _yk_ = _∇f_ ( _ωk_ ) _−∇f_ ( _ωk−_ 1), respectively.


**Algorithm** **1:** Overview of the L-BFGS-GSS optimizer.

**Input:** Objective function _f_ ( _ω_ ) = _⟨l_ ( _x, ω_ ) _⟩_, initial NN parameters _ω_ 0, maximum number of iterations _K_,
training data _x_
**Output:** Optimized NN parameters _ω_ _[⋆]_

**for** _k_ = 1 to _K_ **do**

Compute gradient, _∇f_ ( _ωk_ )
Compute search direction _p_ ( _∇f_ ( _ωk_ ) _, s_ list _, y_ list) via L-BFGS
Determine optimal step size _u_ _[⋆]_ with GSS, such that _f_ ( _ωk −_ _u_ _[⋆]_ _p_ ) is minimized
_ωk_ +1 _←_ _ωk −_ _u_ _[⋆]_ _p_
Update _s_ list, _y_ list
**return** _ω_ _[∗]_ _←_ _ωK_ +1


**C** **Construction** **of** **low-loss** **paths** **between** **two** **points** **on** **the** **landscape**


We have developed a general-purpose path-finding algorithm, called `FourierPathFinder` (Algorithm 2), which
constructs low-loss paths between two points on a multi-dimensional landscape as a combination of a straight line
and a truncated Fourier series:



_ω_ ( _t_ ) = _tω_ _[i]_ + (1 _−_ _t_ ) _ω_ _[j]_ +



_N_ F

- _bn_ sin( _nπt_ ) _,_ (3)


_n_ =1


4


where _ω_ _[i]_ and _ω_ _[j]_ are the initial and final points on the landscape, _t_ _∈_ [0 _,_ 1] is the curve parameter, and _N_ F is the
total number of Fourier terms (we typically set _N_ F = 10). The Fourier coefficients _bn_ are initialized to 0. For NN loss
landscapes, we discretize the curve parameter _t_ into _M_ = 50 equally spaced values.

The total loss along the path in Eq. (3) is computed as:



_M_ _−_ 1

- _|ω_ ( _tm_ +1) _−_ _ω_ ( _tm_ ) _|_ [2] _,_ (4)


_m_ =1



_L_ ( _ω_ _[i]_ _, ω_ _[j]_ ) =



_M_

- _⟨l_ ( _x, ω_ ( _tm_ )) _⟩_ + _λ_


_m_ =1



where the first term is the cumulative loss along the path. The second term is a regularization penalty, scaled by
the hyperparameter _λ_ which controls the smoothness and the non-linearity of the path. We choose _λ_ = 10 _[−]_ [4] for the
paths on NN loss landscapes - we find that this value provides a reasonable balance between the total path length
and the cumulative loss along the path.


**Algorithm** **2:** Overview of the `FourierPathFinder` algorithm.

**Input:** Path loss function _L_ ( _ω_ _[i]_ _, ω_ _[j]_ ) (Eq. (4)), maximum number of iterations _K_, input data _{x}_, curve
parameter values _{tm}_ _[M]_ _m_ =1 [,] [regularization] [coefficient] _[λ]_ [,] [Fourier] [coefficients] _[{][b][n][}][N]_ _n_ =1 [F] [initialized] [to] [0.]
**Output:** Optimized Fourier coefficients _{b_ _[⋆]_ _n_ _[}][N]_ _n_ =1 [F] [.]
**for** _k_ = 1 **to** _K_ **do**

Compute NN loss gradients with respect to NN parameters at each _tm_ : _gm_ ( _x_ ) = _[∂][⟨][l]_ [(] _∂ω_ _[x,ω]_ [)] _[⟩]_ _|ω_ = _ω_ ( _tm_ )

Compute the path loss gradient with respect to the Fourier coefficients:
_∂L_
_∂bn_ [=][ �] _m_ _[M]_ =1 _[g][m]_ [(] _[x]_ [) sin(] _[nπt][m]_ [) + 2] _[λ]_ [ �] _m_ _[M]_ =1 _[−]_ [1][[] _[ω]_ [(] _[t][m]_ [+1][)] _[ −]_ _[ω]_ [(] _[t][m]_ [)][sin(] _[nπt][m]_ [+1][)] _[ −]_ [sin(] _[nπt][m]_ [)]]
Update _{bn}_ _[N]_ _n_ =1 [F] [using] [Adam] [optimizer] [[][18][]] [on] [the] [entire] [dataset] _[{][x][}]_
**return** _{b_ _[⋆]_ _n_ _[}][N]_ _n_ =1 [F] _[←{][b][n][}]_ _n_ _[N]_ =1 [F]


To characterize barrier height along a given path, we compute path height, defined as the maximum loss encountered
along the discretized trajectory:


_H_ = max (5)
_tm_ _[{⟨][l]_ [(] _[x, ω]_ [(] _[t][m]_ [))] _[⟩}][ .]_


**D** **Dimensionality** **reduction** **for** **characterizing** **optimized** **NN** **parameter** **sets**


To visualize the training or test sets of NN parameters optimized using either L-BFGS or SGD, we employ a
dimensionality reduction technique called kernel Principal Component Analysis (kPCA) [22, 41]. Briefly, kPCA is a
nonlinear generalization of standard PCA, a linear dimensionality reduction method designed to identify orthogonal
directions (principal components) along which the data varies most [22]. kPCA extends this approach to capture
nonlinear structures in the data by implicitly mapping input datapoints _x_ _∈_ R _[D]_ into a feature space _ϕ_ ( _x_ ) _∈_ R _[M]_

through nonlinear mapping _x →_ _ϕ_ ( _x_ ).
The similarity between two points _x_ and _x_ _[′]_ in the feature space is expressed through a kernel function _k_ ( _x, x_ _[′]_ ) =
_ϕ_ ( _x_ ) _[T]_ _ϕ_ ( _x_ _[′]_ ), which computes the inner product between their feature-space representations. Common kernel functions
include the linear kernel _k_ ( _x, x_ _[′]_ ) = _x_ _[T]_ _x_ _[′]_, the degree _n_ polynomial kernel _k_ ( _x, x_ _[′]_ ) = ( _x_ _[T]_ _x_ _[′]_ + _C_ ) _[n]_, and the radial
basis function (RBF) kernel _k_ ( _x, x_ _[′]_ ) = exp ( _−|x −_ _x_ _[′]_ _|_ [2] _/_ 2 _σ_ [2] ), each defining a different notion of similarity between
datapoints _x_ and _x_ _[′]_ . Each kernel corresponds to a potentially infinite-dimensional set of feature vectors. Note also
that kernels often depend on hyperparameters such as _C_ in the polynomial or _σ_ in the RBF kernel. We set 2 _σ_ [2] = _N_ prm
in visualizing optimized vectors of NN weights and biases.

As is typical in kernel-based methods, kPCA avoids constructing the feature vectors explicitly  - the dimensionality
reduction is carried out using the kernel matrix _K_ _∈_ R _[N]_ _[×][N]_, where _Kij_ = _k_ ( _xi, xj_ ) and _N_ is the number of datapoints.
Specifically, the kernel matrix is centralized [22]: _K_ _→_ _K_ [�], where the centralized kernel corresponds to the feature
vectors with zero mean: _K_ [�] _ij_ = [�] _k_ ( _xi, xj_ ) = _ϕ_ [�] ( _xi_ ) _[T]_ [ �] _ϕ_ ( _xj_ ), with [�] _n_ _[N]_ =1 _[ϕ]_ [�][(] _[x][n]_ [) = 0.] [Next, the eigenvalues and eigenvectors]
of the _N_ _× N_ centralized kernel matrix are found by solving the eigenvalue problem: _Kα_ [(] _[k]_ [)] = _λ_ [(] _[k]_ [)] _α_ [(] _[k]_ [)] . Finally, the

[�]
principal component projections are computed using PC _k_ ( _x_ ) = [�] _i_ _[N]_ =1 _[α]_ _i_ [(] _[k]_ [)] _k_ ( _x, xi_ ), where _k_ labels the eigenvalues and
_x_ is the input vector to be projected.


5

## **III Results**


**A** **Overview** **of** **NN** **optimization** **and** **loss** **landscape** **visualization**


Our approach to NN training and loss landscape exploration is outlined in Figure 1. We train four NN architectures
(FCP, LeNet CNN, Autoencoder, and LSTM) on a set of MNIST images [32] using two algorithms: Stochastic
Gradient Descent (SGD) [39] with 64 images per mini-batch and a customized quasi-Newton algorithm, L-BFGS-GSS
(Methods). We obtain sets of optimized NN parameters located in low-loss regions of the multi-dimensional loss
landscapes and study the depths of these minima, their basins of attraction, and the heights of the barriers separating
optimized parameter vectors from one another.


Figure 1: **Generation** **and** **visualization** **of** **optimized** **NN** **parameter** **sets.** (a) A subset of input
training/test data. A single 28 _×_ 28 MNIST image [32] is used as NN input. (b) Representative NN architecture,
with an input layer, two hidden layers, and an output layer. (c) A conceptual sketch of the corresponding NN loss
landscape, with two local minima (red dots) located in a shallow valley. The basins of attraction of the two minima
are separated by a relatively low barrier.


Specifically, we assemble four sets of optimized parameters for each of the four NN architectures considered in
this work: FCP, LeNet CNN, Autoencoder, and LSTM (see Methods for NN implementation details). All neural
nets employ _O_ (10 [4] ) fitting parameters (Table I). The first two sets, _{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [and] _[{][ω]_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [,] [correspond] [to] [the]
solutions obtained using the L-BFGS-GSS quasi-Newton algorithm without mini-batches (Algorithm 1; see Methods
for details). The second two sets, _{ω_ SGD [train] _[,i][}]_ _i_ [48] =1 [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [,] [comprise] [solutions] [obtained] [using] [SGD] [[][9][,] [42][]] [with]
64-image mini-batches. Each NN model is trained starting from 75 different random initializations of weights and
biases for each optimizer type; 48 solutions with the lowest training loss from each method are selected to form
_{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [and] _[{][ω]_ SGD [train] _[,i][}]_ _i_ [48] =1 [.] [To] [obtain] [the] [corresponding] [test] [set] [fitting] [weights,] _[{][ω]_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [,] [we]
employ early stopping at the minimum of test loss for the models included into our training sets [7].


Figure 2 shows a representative example of training/test L-BFGS-GSS and SGD loss curves for the LSTM network
(loss curves for the other three architectures are displayed in Fig. S1). The training or test optimized NN parameter
sets correspond to the minimum of the corresponding loss curve. Table I shows the average loss over 48 independent
runs. For all NN architectures, the values of the average training loss are considerably lower for the L-BFGS-GSS
optimizer compared to SGD. However, the average test loss values are comparable, indicating that the L-BFGS-GSS
training weights are likely to be overfit. Note also that the L-BFGS-GSS test loss curves rise sharply from the minima
in all NN architectures except the autoencoder (cf. blue lines in Figs. 2b and S1b,d,f). In contrast, SGD weight sets
appear to be more generalizable.


6


Figure 2: **LSTM** **loss** **curves** . Representative LSTM training (a) and test (b) loss curves ( _⟨l_ ( _x_ [train] _, ω_ ) _⟩_ and
_⟨l_ ( _x_ [test] _, ω_ ) _⟩_, respectively) as a function of the number of epochs. In both panels, dashed vertical lines mark the
epochs where the loss curves of the same color reach their minima. The weight configurations _ω_ SGD [train] _[, ω]_ SGD [test] [and]
_ω_ BFGS [train] _[, ω]_ BFGS [test] [denote] [the] [sets] [of] [NN] [parameters] [found] [at] [these] [minima] [(optimized] [with] [SGD] [and] [L-BFGS-GSS,]
respectively).


Table I: **Average** **training** **and** **test** **loss.** For each NN architecture, we list the training loss _⟨l_ ( _x_ [train] _, ω_ [train] ) _⟩_ and
the test loss _⟨l_ ( _x_ [test] _, ω_ [test] ) _⟩_ averaged over 48 independent runs. Also listed are _N_ prm, the total number of NN fitting
parameters (weights and biases) in each of the four architectures.


_⟨l_ ( _x_ [train] _, ω_ [train] ) _⟩_ _⟨l_ ( _x_ [test] _, ω_ [test] ) _⟩_


**NN** **L-BFGS** **SGD** **L-BFGS** **SGD** _N_ prm


FCP 1.26e-08 6.21e-04 9.69e-02 8.25e-02 42200
LeNet 3.35e-08 1.76e-05 4.17e-02 3.89e-02 61706
Autoencoder 1.69e-02 4.57e-02 1.65e-02 4.52e-02 52224
LSTM 1.63e-06 1.35e-02 1.55e-01 1.28e-01 15456


**B** **Low-loss** **paths** **connecting** **optimized** **states** **on** **NN** **loss** **landscapes**


We have developed `FourierPathFinder`, an algorithm for finding low-height paths connecting two points on multidimensional loss or energy landscapes (Algorithm 2; see Methods for implementation details). Figure 3a illustrates
our algorithm on a synthetic 2D landscape _f_ ( _x, y_ ) with two local minima - shown are a linear path between the two
minima and three paths found using `FourierPathFinder` with increasing regularization penalties: _λ_ = 10 _,_ 100 _,_ 1000.
Figure 3b traces the corresponding loss values along these paths, given here by the values of _f_ ( _x, y_ ) along each
parametrized curve.
We observe that all three optimized paths find a low-loss valley between two neighboring maxima. However, the
length of the _λ_ = 10 path is not sufficiently constrained, enabling it to spend more time in the low-loss regions around
the two minima and make larger steps in crossing the barrier between the two basins of attraction (cf. the spacing
of the blue points in Fig. 3a and the loss profile for the _λ_ = 10 curve in Fig. 3b). Larger values of _λ_ prevent this
non-uniform behavior and result in more regular paths. Despite these differences, the maximum height along the path
(Eq. (5)) is fairly insensitive to _λ_ . Thus, there is no need to fine-tune this hyperparameter.
Next, we consider the heights of the paths connecting optimized vectors of parameters on the NN loss landscapes.
For each of the four sets containing 48 vectors of trained parameters, we randomly choose 300 pairs of vectors and
use `FourierPathFinder` (with _λ_ = 10 _[−]_ [4] ) to find the low-loss paths connecting them. We record the corresponding


7


Figure 3: **Low-loss** **paths** **on** **a** **2D** **landscape.** (a) Two-dimensional loss landscape composed of two positive and
two negative Gaussian peaks: _f_ ( _x, y_ ) = _−_ [�][2] _i_ =1 [exp[] _[−]_ [3] _[|]_ **[r]** _[ −]_ **[c]** _[i][|]_ [2][] +][ �] _j_ [2] =1 [exp[] _[−]_ [15] _[|]_ **[r]** _[ −]_ **[d]** _[j][|]_ [2][] +] _[ C]_ [,] [where] **[r]** [ = (] _[x, y]_ [),]
**c** 1 = ( _−_ 0 _._ 5 _, −_ 0 _._ 5), **c** 2 = (0 _._ 5 _,_ 0 _._ 0), **d** 1 = ( _−_ 0 _._ 2 _, −_ 0 _._ 4), **d** 2 = (0 _._ 0 _,_ 0 _._ 3), and _C_ = 1 _._ 019. Four representative paths
connecting two landscape minima: **w** 1 = ( _−_ 0 _._ 62 _, −_ 0 _._ 54) and **w** 2 = (0 _._ 49 _, −_ 0 _._ 02) are shown: a linear interpolation
path (dashed blue line) and three `FourierPathFinder` optimized paths ( _λ_ = 10, solid blue curve; _λ_ = 100, solid
orange curve; _λ_ = 1000, solid green curve). Dots indicate function values at discrete time steps _tm_ _∈_ [0 _,_ 1] along the
path: _f_ ( _x_ ( _tm_ ) _, y_ ( _tm_ )), _m_ = 1 _. . . M_ ( _M_ = 100). (b) Loss values _f_ ( _x_ ( _t_ ) _, y_ ( _t_ )) as a function of the curve parameter _t_
along the four paths in panel (a): the linear interpolation path (dashed blue curve) and three `FourierPathFinder`
paths (solid curves with the colors matching the paths in panel (a)). Path heights _Hi_ (Eq. (5)) are labeled with
black dots, with _H_ 0 = 1 _._ 102 (straight line), _H_ 1 = 0 _._ 646 (optimized path, _λ_ = 10), _H_ 2 = 0 _._ 640 (optimized path,
_λ_ = 100), and _H_ 3 = 0 _._ 652 (optimized path, _λ_ = 1000).


path heights (Eq. (5)), which characterize the connectivity of optimized vectors _ω_ in the parameter space.
We find that, with the exception of Autoencoder, the barrier heights are lower for the SGD solutions compared
to BFGS. This is true for both _{ω_ SGD [test] _[,i][}]_ _i_ [48] =1 [and] _[{][ω]_ SGD [train] _[,i][}]_ _i_ [48] =1 [on] [the] [training] [landscape] [(Fig.] [4][)] [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [on]
the test landscape (Fig. S2). This indicates that SGD solutions are located in smoother, more accessible regions of
the loss landscape. In contrast, BFGS solutions _{ω_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [and] _[{][ω]_ BFGS [train] _[,i][}]_ _i_ [48] =1 [are] [characterized] [by] [higher] [barriers] [on]
both landscapes, indicating that those vectors of optimized parameters are more isolated from one another. Note that
Autoencoder is probably an exception because it does not exhibit strong BFGS overfitting prominent in the other
three NN architectures (Fig. S1, Table I).
Interestingly, on the training landscape the BFGS barrier heights between vectors of training weights are only
higher than the barrier heights between vectors of test weights in two out of four NN architectures, FCP and LSTM
(cf. navy blue and light blue histograms in Fig. 4). This is surprising because BFGS training weights are overfit for
FCP, LeNet, and LSTM (Table I). In other words, the L-BFGS-GSS optimizer does not necessarily find more isolated
minima with additional training, even if overfitting occurs. Although the same observation is true for SGD (cf. light
red and gold histograms in Fig. 4), it is less surprising there due to much weaker signatures of overfitting in the case
of SGD optimization.


**C** **Statistics** **of** **optimized** **NN** **parameters**


In addition to the analysis of the paths connecting pairs of optimized vectors of NN parameters, we consider the
statistics of optimized NN weights and biases. To this end, we compute the means and standard deviations of the
components of _W_ BFGS [train,j][,] _[W]_ [ test,j] BFGS [,] _[W]_ [ train,j] SGD [,] _[W]_ [ test,j] SGD [vectors,] [where] [each] _[W]_ [vector] [is] [constructed] [by] [concatenation] [of]
the corresponding _{ω_ _[i]_ _}_ [48] _i_ =1 [set] [of] [vectors] [and] _[j]_ [=] [1] _[ . . .]_ [ 4] [labels] [NN] [architectures] [(Table] [S1][).] [We] [see] [that] [there] [is] [a]
clear difference between SGD and BFGS weights, with the latter characterized by larger standard deviations _σ_ . Thus,
BFGS fitting weights tend to be more spread out in parameter space.


8


Figure 4: **Distribution** **of** **barrier** **heights** **along** **optimized** **paths** **on** **the** **training** **landscape.** Shown are
distributions of the `FourierPathFinder` path heights (Eq. (5)) for FCP (a), LeNet (b), Autoencoder (c), and LSTM
(d). Histograms in each panel show heights of 300 low-loss paths connecting randomly chosen pairs of optimized
parameter vectors in _{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [(navy] [blue),] _[{][ω]_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [(light] [blue),] _[{][ω]_ SGD [train] _[,i][}]_ _i_ [48] =1 [(light] [red),] [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1
(gold). The paths are computed on the training landscape, _⟨l_ ( _x_ [train] _, ω_ ) _⟩_ .


Another way to see the extent of the spread is to compare the _L_ 2 lengths of the SGD and BFGS weight vectors.
We focus first on the comparison between SGD test and BFGS training weights since the latter are overfit (except in
the Autoencoder; Figs. 2 and S1, Table I), enabling us to contrast SGD weight sets that one would use in practice
with low-loss, non-generalizable solutions obtained by L-BFGS-GSS. Specifically, we define _ω_ ¯BFGS = 481 �48 _i_ =1 _[ω]_ BFGS [test] _[,i]_
and _ω_ ¯SGD = 481 �48 _i_ =1 _[ω]_ SGD [test] _[,i]_ [as] [the] [centroids] [of] [the] [optimized] [weight] [vector] [sets] [and] [use] _[ω]_ [¯] [=] [1] 2 [(¯] _[ω]_ [BFGS] [+] _[ω]_ [¯][SGD][)] [as]

the common origin of all weight vectors. For each individual weight vector _ω_ _[i]_, we calculate its _L_ 2 distance from the
origin as _|ω_ _[i]_ _−_ _ω_ ¯ _|_ .
The histogram of _L_ 2 distances shows that, as expected from Table S1, BFGS weight vectors tend to be longer than
SGD weight vectors (Fig. 5). This indicates that optimized weight vectors found by L-BFGS-GSS are more widely
dispersed compared to the SGD solutions, which form a more compact distribution. The distance between _ω_ ¯BFGS
and _ω_ ¯SGD is small compared to the spread of vector lengths within each group (cf. vertical dotted lines in Fig. 5),
indicating that there is no strongly preferred direction in the parameter space. Next, we consider SGD and BFGS
test weights, as those are the weight vector sets one would use in practice (Fig. S3). We observe that, as might be
expected, the SGD and BFGS vector lengths become less different for FCP and LeNet. Surprisingly, the gap between
vector length histograms remains nearly the same for Autoencoder and LSTM, despite the latter being overfit in going
from test to training weight sets.


**D** **Low-dimensional** **projections** **of** **optimized** **weight** **vectors**


We checked whether the differences between BFGS training and SGD test weight vectors can be detected using
principal component analysis (PCA) - a dimensionality reduction technique often used in data visualization [22].
Specifically, we have applied kernel PCA (kPCA; see Methods for details) to _{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [sets] [of]


9


Figure 5: **Distributions** **of** **SGD** **test** **and** **BFGS** **training** **weight** **vector** **lengths.** Shown are the histograms
of _L_ 2 distances between individual weight vectors _ωi_ and the common origin _ω_ ¯, _|ω_ _[i]_ _−_ _ω_ ¯ _|_ . Distributions of the BFGS
training ( _{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [)] [and] [SGD] [test] [(] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [)] [weight] [vector] [lengths] [are] [plotted] [in] [blue] [and] [light] [red,]
respectively, for FCP (a), LeNet (b), Autoencoder (c), and LSTM (d). Dotted vertical lines indicate the positions of
_|ω_ ¯BFGS _−_ _ω_ ¯ _|_ = _|ω_ ¯SGD _−_ _ω_ ¯ _|_ .


optimized weight vectors for each NN architecture (Fig. 6). In all four cases, we see clear separation of BFGS and SGD
vectors projected onto two first principal components PC1 and PC2. Interestingly, the separation is predominantly
along the first principal component, indicating that the BFGS and SGD weight vectors form two distinct clusters
in the parameter space. Moreover, the separation is only observed with the RBF kernel and disappears when other
kernels such as polynomial and sigmoid are used, or when standard PCA is employed (data not shown). Thus, the
separation is radial rather than along a preferred direction, consistent with the larger BFGS vector lengths and the
absence of preferred directions in Fig. 5.
When kPCA is applied to BFGS and SGD test weight vectors (Fig. S4), cluster separation nearly disappears for
FCP and LeNet but persists for Autoencoder and LSTM, in agreement with Fig. S3.

## **IV Discussion and Conclusion**


The results presented here demonstrate that the balance between generalization and overfitting profoundly influences
the nature of optimized neural network solutions. Consistent with previous observations [11, 20, 21], we find that
SGD produces more generalizable solutions that occupy flatter, more connected basins of the loss landscape, whereas
L-BFGS-GSS solutions consist of sharper, more isolated minima separated by higher barriers. The latter behavior is
particularly pronounced if the L-BFGS-GSS optimizer is allowed to overfit, converging to solutions which have much
lower loss compared to SGD (Table I).
These observations are confirmed by the analysis of the paths connecting pairs of optimized weight vectors in
multi-dimensional parameter space. We have developed a novel algorithm, `FourierPathFinder`, which uses a Fourier
expansion of paths combined with stochastic gradient optimization to find low-height paths between two points on


10


Figure 6: **kPCA** **projections** **of** **SGD** **test** **and** **BFGS** **training** **weight** **vectors.** Shown are the first two
principal components, PC1 and PC2, obtained by kPCA with the RBF kernel (Methods). The projections are
applied to _{ω_ BFGS [train] _[,i][}]_ _i_ [48] =1 [(blue] [points)] [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [(red] [points)] [sets] [of] [optimized] [weight] [vectors,] [for] [FCP] [(a),]
LeNet (b), Autoencoder (c), and LSTM (d).


arbitrary loss or energy landscapes. We find that SGD solutions are typically separated by lower energy barriers than
those obtained with L-BFGS-GSS (Figs. 4, S2). The lower barrier heights encountered along SGD paths suggest that
SGD solutions tend to lie in broad, smoothly connected valleys of the loss surface, whereas L-BFGS-GSS solutions
appear to be embedded in steeper, more difficult-to-navigate regions. Thus, our path analysis supports the view that
SGD tends to converge to flatter minima, a hallmark of better generalization, while L-BFGS-GSS, a quasi-Newton
method guided by curvature information, is more prone to settling in narrow, high-curvature basins that fit the
training data very well but generalize poorly.
This interpretation is reinforced by the analysis of the lengths of optimized weight vectors (Figs. 5, S3; Table S1).
SGD solutions cluster more compactly near a common centroid, while L-BFGS-GSS solutions are distributed farther
from the center, forming a larger-radius shell in parameter space. There appear to be no strongly preferred directions
within the SGD and BFGS shells - the main difference is in the vector lengths, explained at least in part by the
larger magnitudes of BFGS vector components (Table S1). Interestingly, the centroids of the SGD and BFGS weight
vectors are relatively close to one another, supporting the idea of a nested, shell-like organization of SGD and BFGS
weight vectors in the parameter space.
Further evidence of these structural differences emerges from visualization of multi-dimensional weight vectors


11


based on kPCA projections (Figs. 6, S4). kPCA analysis with a spherically symmetric, non-linear RBF kernel reveals
clear separation between the solution sets produced by SGD and L-BFGS-GSS, especially when the latter algorithm
is allowed to overfit. This observation implies that the two optimizers converge to distinct, nonlinearly separable
manifolds in parameter space rather than to nearby points within a single connected region.
Taken together, our results show that SGD solutions occupy relatively compact, flatter regions of the loss landscape,
while L-BFGS-GSS solutions concentrate within a larger-diameter shell corresponding to higher-curvature, less accessible minima. This radial organization supports the idea that stochastic gradient based methods tend to find central,
robust basins in parameter space, while deterministic quasi-Newton methods converge toward more spread-out, less
generalizable minima. Thus, the choice of the optimizer affects not only convergence speed but also the qualitative
nature of the resulting solutions. The differences between SGD and L-BFGS-GSS reflect fundamentally different
optimization dynamics that guide each method toward distinct regions of the loss landscape.
In practical terms, smoother connectivity between SGD minima facilitates model averaging and transfer compared to
the L-BFGS-GSS approach. More broadly, the low-barrier connectivity, compact clustering, and nonlinear separability
of generalizable solutions provide a geometric foundation for understanding why flatter minima, favored by SGD, tend
to yield more robust performance in neural networks. In summary, our findings underscore how optimizer choice in
machine-learning contexts affects not only the efficiency of convergence to low-loss solutions, but also the geometry
and diversity of the solutions themselves - with potential consequences for generalization and robustness.

## **Software and Data Availability**


The neural network training and loss landscape analysis software was written in Python and is available via GitHub
at `https://github.com/jy856-jpg/path-finding` .

## **Acknowledgments**


J.Y. and A.V.M. acknowledge financial and logistical support from the Center for Quantitative Biology, Rutgers
University. The authors are grateful to the Office of Advanced Research Computing (OARC) at Rutgers University
for providing access to the Amarel cluster.


[1] J. N. Onuchic and P. G. Wolynes, Theory of protein folding, Curr. Op. Struct. Biol. **14**, 70 (2004).

[2] K. A. Dill, S. B. Ozkan, M. S. Shell, and T. R. Weikl, The protein folding problem, Ann. Rev. Biophys. **37**, 289 (2008).

[3] J. F. Crow and M. Kimura, _An_ _Introduction_ _to_ _Population_ _Genetics_ _Theory_ (Harper and Row, New York, NY, USA, 1970).

[4] M. Kimura, _The_ _Neutral_ _Theory_ _of_ _Molecular_ _Evolution_ (Cambridge University Press, Cambridge, UK, 1983).

[5] J. Gillespie, _Population_ _Genetics:_ _A_ _Concise_ _Guide_ (The Johns Hopkins University Press, Baltimore, MD, USA, 2004).

[6] I. Goodfellow, Y. Bengio, and A. Courville, _Deep_ _Learning_ (MIT Press, Cambridge, MA, USA, 2016).

[7] P. Mehta, M. Bukov, C.-H. Wang, A. G. R. Day, C. Richardson, C. K. Fisher, and D. J. Schwab, A high-bias, low-variance
introduction to Machine Learning for physicists, Phys. Rep. **810**, 1 (2019).

[8] J. Nocedal and S. J. Wright, _Numerical_ _optimization_ (Springer Science+Business Media, LLC, New York, NY, USA, 2006).

[9] S. Ruder, An overview of gradient [descent](https://arxiv.org/abs/1609.04747) optimization algorithms (2017), [arXiv:1609.04747](https://arxiv.org/abs/1609.04747) [cs.LG].

[10] C. Zhang, S. Bengio, M. Hardt, B. Recht, and O. Vinyals, Understanding deep learning (still) requires rethinking generalization, Commun. [ACM](https://doi.org/10.1145/3446776) **64**, 107 (2021).

[11] N. S. Keskar, D. Mudigere, J. Nocedal, M. Smelyanskiy, and P. T. P. Tang, On large-batch [training](https://arxiv.org/abs/1609.04836) for deep learning:
Generalization gap and sharp minima (2017), [arXiv:1609.04836](https://arxiv.org/abs/1609.04836) [cs.LG].

[12] P. Chaudhari, A. Choromanska, S. Soatto, Y. LeCun, C. Baldassi, C. Borgs, J. Chayes, L. Sagun, and R. Zecchina,
Entropy-SGD: biasing gradient descent into wide valleys, Journal of Statistical [Mechanics:](https://doi.org/10.1088/1742-5468/ab39d9) Theory and Experiment **2019**,
124018 (2019).

[13] S. Jastrzebski, Z. Kenton, D. Arpit, N. Ballas, A. Fischer, Y. Bengio, and A. Storkey, Three factors [influencing](https://arxiv.org/abs/1711.04623) minima in
[SGD](https://arxiv.org/abs/1711.04623) (2018), [arXiv:1711.04623](https://arxiv.org/abs/1711.04623) [cs.LG].

[14] Y. Feng and Y. Tu, The inverse variance-flatness relation in stochastic gradient descent is critical for finding flat minima,
Proc. Nat. Acad. Sci. USA **118**, e2015617118 (2021).

[15] M. Wei and D. J. Schwab, How noise affects the hessian [spectrum](https://arxiv.org/abs/1910.00195) in overparameterized neural networks (2019),

[arXiv:1910.00195](https://arxiv.org/abs/1910.00195) [cs.LG].

[16] I. J. Goodfellow, O. Vinyals, and A. M. Saxe, Qualitatively characterizing [neural](https://arxiv.org/abs/1412.6544) network optimization problems (2015),

[arXiv:1412.6544](https://arxiv.org/abs/1412.6544) [cs.NE].


12


[17] H. Li, Z. Xu, G. Taylor, C. Studer, and T. Goldstein, Visualizing the loss landscape of neural nets, in _Advances_ _in_ _Neural_
_Information_ _Processing_ _Systems_, Vol. 31, edited by S. Bengio, H. Wallach, H. Larochelle, K. Grauman, N. Cesa-Bianchi,
and R. Garnett (Curran Associates, Inc., 2018).

[18] D. P. Kingma and J. L. Ba, Adam: A method for [stochastic](https://arxiv.org/abs/1412.6980) optimization (2014), [arXiv:1412.6980](https://arxiv.org/abs/1412.6980) [cs.LG].

[19] T. Tieleman and G. Hinton, Lecture 6.5 - RMSProp: Divide the gradient by a running average of its recent magnitude,
COURSERA: Neural Networks for Machine Learning (2012).

[20] A. C. Wilson, R. Roelofs, M. Stern, N. Srebro, and B. Recht, The marginal value of adaptive gradient methods in machine
learning, in _Proceedings_ _of_ _the_ _31st_ _International_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, NIPS’17 (Curran
Associates Inc., Red Hook, NY, USA, 2017) pp. 4151–4161.

[21] Z. Yao, A. Gholami, K. Keutzer, and M. W. Mahoney, Hessian-based analysis of large batch training and robustness
to adversaries, in _Proceedings_ _of_ _the_ _32nd_ _International_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, NIPS’18
(Curran Associates Inc., Red Hook, NY, USA, 2018) pp. 4954–4964.

[22] C. M. Bishop, _Pattern_ _recognition_ _and_ _machine_ _learning_ (Springer Science+Business Media, LLC, New York, NY, USA,
2006).

[23] B. Ghorbani, S. Krishnan, and Y. Xiao, An investigation into neural net optimization via Hessian eigenvalue density, in
_Proceedings of the 36th International Conference on Machine Learning_, Proceedings of Machine Learning Research, Vol. 97,
edited by K. Chaudhuri and R. Salakhutdinov (PMLR, 2019) pp. 2232–2241.

[24] T. Garipov, P. Izmailov, D. Podoprikhin, D. Vetrov, and A. G. Wilson, Loss surfaces, mode connectivity, and fast ensembling of DNNs, in _Proceedings_ _of_ _the_ _32nd_ _International_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, NIPS’18
(Curran Associates Inc., Red Hook, NY, USA, 2018) pp. 8803–8812.

[25] F. Draxler, K. Veschgini, M. Salmhofer, and F. Hamprecht, Essentially no barriers in neural network energy landscape,
in _Proceedings_ _of_ _the_ _35th_ _[International](https://proceedings.mlr.press/v80/draxler18a.html)_ _Conference_ _on_ _Machine_ _Learning_, Proceedings of Machine Learning Research,
Vol. 80, edited by J. Dy and A. Krause (PMLR, 2018) pp. 1309–1318.

[26] Y. Zhou, J. Yang, H. Zhang, Y. Liang, and V. Tarokh, SGD converges to global [minimum](https://arxiv.org/abs/1901.00451) in deep learning via star-convex
[path](https://arxiv.org/abs/1901.00451) (2019), [arXiv:1901.00451](https://arxiv.org/abs/1901.00451) [cs.LG].

[27] A. Sonthalia, A. Rubinstein, E. Abbasnejad, and S. J. Oh, Do deep neural network [solutions](https://arxiv.org/abs/2403.07968) form a star domain? (2024),

[arXiv:2403.07968](https://arxiv.org/abs/2403.07968) [cs.LG].

[28] C. G. Broyden, Quasi-Newton methods and their application to function minimisation, Mathematics of Computation **24**,
365 (1970).

[29] R. Fletcher, A new approach to variable metric algorithms, The Computer Journal **13**, 317 (1970).

[30] D. Goldfarb, A family of variable-metric methods derived by variational means, Mathematics of Computation **24**, 23
(1970).

[31] D. F. Shanno, Conditioning of quasi-Newton methods for function minimization, Mathematics of Computation **24**, 647
(1970).

[32] L. Deng, The MNIST database of handwritten digit images for machine learning research [best of the Web], IEEE Signal
Processing [Magazine](https://doi.org/10.1109/MSP.2012.2211477) **29**, 141 (2012).

[33] J. Denker, W. Gardner, H. Graf, D. Henderson, R. Howard, W. Hubbard, L. D. Jackel, H. Baird, and I. Guyon, Neural
network recognizer for hand-written zip code digits, in _Advances_ _in_ _Neural_ _[Information](https://proceedings.neurips.cc/paper_files/paper/1988/file/a97da629b098b75c294dffdc3e463904-Paper.pdf)_ _Processing_ _Systems_, Vol. 1, edited
by D. Touretzky (Morgan-Kaufmann, 1988).

[34] Y. LeCun, L. Bottou, Y. Bengio, and P. Haffner, Gradient-based learning applied to document recognition, [Proceedings](https://doi.org/10.1109/5.726791)
of the IEEE **[86](https://doi.org/10.1109/5.726791)**, 2278 (1998).

[35] S. Hochreiter and J. Schmidhuber, Long short-term memory, Neural [Computation](https://doi.org/10.1162/neco.1997.9.8.1735) **9**, 1735 (1997).

[36] Q. V. Le, N. Jaitly, and G. E. Hinton, A simple way to initialize [recurrent](https://arxiv.org/abs/1504.00941) networks of rectified linear units (2015),

[arXiv:1504.00941](https://arxiv.org/abs/1504.00941) [cs.NE].

[37] D. E. Rumelhart, G. E. Hinton, and R. J. Williams, Learning internal representations by error propagation, in _Parallel_
_Distributed_ _Processing:_ _Explorations_ _in_ _the_ _Microstructure_ _of_ _Cognition,_ _Vol._ _1:_ _Foundations_ (MIT Press, Cambridge, MA,
USA, 1986) pp. 318–362.

[38] W. H. Press, S. A. Teukolsky, W. T. Vetterling, and B. P. Flannery, _Numerical_ _Recipes:_ _The_ _Art_ _of_ _Scientific_ _Computing_,
3rd ed. (Cambridge University Press, Cambridge, UK, 2007).

[39] L. Bottou, F. E. Curtis, and J. Nocedal, Optimization methods for large-scale machine learning, SIAM [Review](https://doi.org/10.1137/16M1080173) **60**, 223
[(2018).](https://doi.org/10.1137/16M1080173)

[40] P. Wolfe, Convergence conditions for ascent methods, SIAM Review **11**, 226 (1969).

[41] B. Scholkopf, A. Smola, and K.-R. Muller, Nonlinear component analysis as a kernel eigenvalue problem, Neural Computation **10**, 1299 (1998).

[42] H. Robbins and S. Monro, A stochastic approximation method, The Annals of [Mathematical](https://doi.org/10.1214/aoms/1177729586) Statistics **22**, 400 (1951).


13


## **Supplementary Materials**

Figure S1: **Additional** **examples** **of** **loss** **curves.** Same as Fig. 2 but for FCP (training: a, test: b), LeNet
(training: c, test: d), and Autoencoder (training: e, test: f) NN architectures.


14


Figure S2: **Distribution** **of** **barrier** **heights** **along** **optimized** **paths** **on** **the** **test** **landscape.** Shown are
distributions of the `FourierPathFinder` path heights (Eq. (5)) for FCP (a), LeNet (b), Autoencoder (c), and LSTM
(d). Histograms in each panel show heights of 300 low-loss paths connecting randomly chosen pairs of optimized
parameter vectors in _{ω_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [(light] [blue)] [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [(gold).] [The] [paths] [are] [computed] [on] [the] [test] [landscape,]
_⟨l_ ( _x_ [test] _, ω_ ) _⟩_ .


15



Figure S3: **Distributions** **of** **SGD** **and** **BFGS** **test** **weight** **vector** **lengths.** Shown are the histograms of _L_ 2
distances between individual weight vectors _ωi_ and the common origin _ω_ ¯, _|ω_ _[i]_ _−_ _ω_ ¯ _|_ . Distributions of the BFGS
( _{ω_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [)] [and] [SGD] [(] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [)] [test] [weight] [vector] [lengths] [are] [plotted] [in] [blue] [and] [light] [red,] [respectively,] [for]
FCP (a), LeNet (b), Autoencoder (c), and LSTM (d). Dotted vertical lines indicate the positions of
_|ω_ ¯BFGS _−_ _ω_ ¯ _|_ = _|ω_ ¯SGD _−_ _ω_ ¯ _|_ .


16



(a)


(c)



0.4

0.3

0.2

0.1

0.0

0.1

0.2

0.3

0.4


0.4


0.3


0.2


0.1


0.0


0.1


0.2


0.3



0.6


0.4


0.2


0.0


0.8


0.6


0.4


0.2


0.0


0.2



FCP


PC1

Autoencoder



(b)


(d)



LeNet


PC1

LSTM


PC1



PC1



Figure S4: **kPCA** **projections** **of** **SGD** **and** **BFGS** **test** **weight** **vectors.** Shown are the first two principal
components, PC1 and PC2, obtained by kPCA with the RBF kernel (Methods). The projections are applied to
_{ω_ BFGS [test] _[,i]_ _[}]_ _i_ [48] =1 [(blue] [points)] [and] _[{][ω]_ SGD [test] _[,i][}]_ _i_ [48] =1 [(red] [points)] [sets] [of] [optimized] [weight] [vectors,] [for] [FCP] [(a),] [LeNet] [(b),]
Autoencoder (c), and LSTM (d).


17



Table S1: **Statistics** **of** **training** **and** **test** **weight** **distributions.** Means ( _µ_ ) and standard deviations ( _σ_ ) of
_W_ SGD [train][,] _[W]_ [ train] BFGS [,] _[W]_ [ test] SGD [,] _[W]_ [ test] BFGS [–] [combined] [vectors] [of] [optimized] [weights] [and] [biases] [for] [each] [NN] [architecture.]


**Training** **weights** **Test** **weights**

NN SGD L-BFGS-GSS SGD L-BFGS-GSS

_µ_ _σ_ _µ_ _σ_ _µ_ _σ_ _µ_ _σ_

FCP -1.44e-03 1.39e-01 -2.47e-03 2.34e-01 -3.17e-03 1.03e-01 -4.11e-03 1.22e-01

LeNet -3.57e-03 8.77e-02 1.04e-03 1.08e-01 -2.83e-03 7.06e-02 2.33e-04 8.00e-02

Autoencoder -7.06e-03 8.54e-02 -3.65e-02 1.60e-01 -7.07e-03 8.54e-02 -3.65e-02 1.61e-01

LSTM 1.35e-02 3.24e-01 1.06e-02 7.33e-01 1.16e-02 2.59e-01 2.92e-03 4.76e-01


