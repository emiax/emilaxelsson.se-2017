import React from 'react';
import { Link } from 'react-router';
import TeX from 'react-components/js/tex.jsx';
import StainsComponent from './stainscomponent';
import NavBar from './navbar';

export default class extends React.Component {
  render() {
    let pw = "\\mathbf{p}_w";
    let pd = "\\mathbf{p}_d";

    let pw1 = "\\mathbf{p}_{w_1}";
    let pw1Prime = "\\mathbf{p}_{w_1}^\\prime";
    let pw2 = "\\mathbf{p}_{w_2}";
    let pw2Prime = "\\mathbf{p}_{w_2}^\\prime";

    let fAdv = "f_{\\text{adv}}";
    let fDrying = "f_{\\text{dry}}";
    let fDryingEq0 = "f_{\\text{dry}} = 0";
    let fDryingEq1 = "f_{\\text{dry}} = 1";
    let vDrying = "v_{\\text{dry}}";
    let fDiffusion = "f_{\\text{dif}_i}";
    let vDiffusion = "v_{\\text{dif}}";
    let waterAdvectionEquation = "w_1 = w_1^\\prime \\cdot (1 - " + fAdv + "(w_1^\\prime)) + w_2^\\prime \\cdot " + fAdv + "(w_2^\\prime)";
    let wetAdvectionEquation = "\\mathbf{p}_{w_1} = \\mathbf{p}_{w_1}^\\prime \\cdot (1 - " + fAdv + "(w_1^\\prime)) + \\mathbf{p}_{w_2}^\\prime \\cdot " + fAdv + "(w_2^\\prime)";
    //let waterAdvectionFactorEquation = fAdv + "(w) = \\left\\{\\begin{array}{lr}0 & w < w_{threshold}\\\\3(w-w_{threshold})^2 - 2(w-w_{threshold})^3\\end{array}\\right\\}";
    //let waterClamping = '[0, (\\text{lowerThreshold} + \\text{upperThreshold}) / 2]';
    let evaporationEquation = "w = \\text{max}(0, w^\\prime - v_e)";
    let advectionFactorImplementation = [
      'float advectionFactor(waterAmount)\n' +
      '  return smoothstep(lowerThreshold, upperThreshold, waterAmount);\n' +
      '}'];

    let dryingEquationDry = '\\mathbf{p}_d = \\mathbf{p}_d^\\prime + ' + fDrying + '\\cdot \\mathbf{p}_w^\\prime';
    let dryingEquationWet = '\\mathbf{p}_w = \\mathbf{p}_w^\\prime - ' + fDrying + '\\cdot \\mathbf{p}_w^\\prime';

    let dryingRateEquation = fDrying + ' = \\max(\\min(' + vDrying + ' \\cdot (1 + \\epsilon(x, y), 1), 0)';
    let diffusionFactorEquation = fDiffusion + ' = \\text{min}(' + vDiffusion + '\\cdot w^\\prime \\cdot w_i^\\prime, \\frac{1}{4})';

    let diffusionWaterEquation = 'w = (1 - \\sum_{i} ' + fDiffusion + ') \\cdot w^\\prime + \\sum_{i} ' + fDiffusion + 'w^\\prime_i';
    let diffusionPigmentEquation = '\\mathbf{p}_w = (1 - \\sum_{i} ' + fDiffusion + ') \\cdot \\mathbf{p}_w^\\prime + \\sum_{i} ' + fDiffusion + '\\mathbf{p}_{w_i}^\\prime';

    let finalColor = "\\mathbf{c}";
    let finalColorEquation = '\\mathbf{c} = ' + pw + ' + (1 - \\mathbf{p}_{w_a})' + pd;

    return (
      <div>
      <NavBar/>
      <div className="stains-page-header">
        <StainsComponent src="input4.jpg" brushSize={15} randomPaint mousePaint backgroundColor={[0.1, 0.1, 0.1]}/>
      </div>
      <article>
        <h2>Stains: Interactive art in the browser</h2>
        <p>
        <em>Stains</em> is a JavaScript/WebGL library that I created to mimic the
        visual appearance and behaviour of aquarelle on a canvas. The library, which can
        procedurally generate aquarelle paintings is used to create
        artistic-looking elements for my personal website and allow visitors to interact with the content.
        It does not necessarily serve a much deeper purpose than simply looking visually appealing,
        but I also think it is an interesting proof-of-concept for a style of computer graphics,
        that could be used in other contexts, such as digital storytelling,
        computer games, VJing or other forms of interactive art.
        </p>

        <div className="stains-page-widget">
        <StainsComponent src="input2.png" brush="stainsBrush" mousePaint backgroundColor={[0.97, 0.97, 0.97]}/>
        </div>
        <p className="caption">
        Click and draw on the canvas to create your own drip painting.
        </p>

        <h3>Designing the model</h3>
        <p>
        With WebGL, the web browser has lately become a very capable platform for computer graphics, but it is still limited
        in comparison to native applications. Also, while it is reasonable to expect a 3D computer game
        to use the full potential of a computer's performance, it may not be as acceptable for a web site
        to drain all the available resources and make other applications run slow.
        There are sophisticated physical models out there that accurately approximate the behavior of a real fluid,
        but in order to create efficient real-time graphics applications, it is sometimes a good idea to cheat.
        For example, while it still makes sense to base the model on physical laws,
        a correct model covering all phenomena such as surface tension and pressure is not 
        only difficult to implement: it also requires a lot of computational resources to get right.
        </p>
        <p>
        After experimenting with a really simple model, where paint would just be represented
        as a color and an amount, I realized that an important visual aspect of
        aquarelle is the possibility to vary the concentration of pigment in water.
        Hence I modified the model to be able represent both dry and wet paint separately.
        This allows the paint to have a variable concentration of pigment dissolved in the water.
        Separating dry and wet paint also makes it possible to model several important processes in aquarelle;
        the effects that made it into the final implementation are:
        </p>

        <ul>
        <li>Evaporation of water</li>
        <li>Simple advection (movement) of water due to external forces like gravity</li>
        <li>Fixation of wet pigment into the canvas (paint drying)</li>
        <li>Diffusion that allow colors to mix</li>
        </ul>

        <h3>A grid with values</h3>
        <p>
        At the very core of this simulation, a two-dimensional grid is used to represent the canvas.
        In each grid cell, a few values are stored:
        </p>

        <ul>
        <li>Amount of water (scalar value)</li>
        <li>Amount of pigment dissolved in the water (scalar value)</li>
        <li>Color of the dissolved pigment (<TeX>RGB</TeX>-vector)</li>
        <li>Amount of dried pigment (scalar value)</li>
        <li>Color of the dried pigment (<TeX>RGB</TeX>-vector)</li>
        </ul>

        <p>To conclude, a total of nine scalar values per grid cell are used. Typically, a grid cell's size equals the size of one pixel.
        In WebGL this data is represented as two floating point <TeX>RGBA</TeX>-textures and one scalar float texture.
        The two <TeX>RGBA</TeX> textures represent the state of wet and dry pigment respectively,
        with the <TeX>RGB</TeX> channels storing the pigment color and the <TeX>A</TeX> channel storing the amount of pigment.
        The <TeX>RGB</TeX> are premultiplied with the <TeX>A</TeX> channel. This means that 
        instead of <TeX>R, G, B \in [0, 1]</TeX>, the values are multiplied by <TeX>A</TeX> so that <TeX>R, G, B \in [0, A]</TeX>,
        allowing colors to be mixed by simple vector addition. Intuitively, increasing the pigment amount (larger <TeX>A</TeX>-value)
        increases the contribution to a color mix. The scalar texture is used to store the amount of water in each cell. 
        </p>

        <p>
        Manipulation of the grid, i.e. addition of new paint and simulation of existing paint,
        is done by feeding in the grid textures as input to a shader program, that writes new values to a new set of textures.
        Once the new state of the simulation has been stored in a set of textures, the old texture set can be reused for the next simulation increment.
        This means that in total, one canvas requires four <TeX>RGBA</TeX>-textures and two scalar ones. 
        </p>


        <h3>Simulating paint on the canvas</h3>
        <p>
        The image below illustrates the flow of data between the textures. 

        </p>
        <svg viewBox="0 0 410 310">
          <use xlinkHref="mechanism.svg#mechanism"></use>
        </svg>
        <p className="caption">
        The four components of the simulation: Evaporation of water, advection of water and pigment, drying of pigments, and diffusion of water and pigments.
        </p>

        <p>
        The WebGL 1.0 standard does not support multiple render targets,
        meaning that a framebuffer object can only have one color attachment.
        Hence, the implementation divides each simulation increment into three shader passes,
        where the first one computes the new water texture,
        the second one computes the new wet pigment texture and
        the third computes the new dry pigment texture.
        </p>

        <svg viewBox="0 0 280 100">
          <use xlinkHref="shaderpasses.svg#shaderpasses"></use>
        </svg>
        <p className="caption">
        The arrows indicate which values that are needed to compute new ones. For example, water data is required to advect wet pigment correctly,
        and the wet pigment is required to compute the new dry pigment texture.</p>

        <p>Let us now look closer into how the four different effects are modelled and implemented.</p>
        <h4>Advection</h4>
        <p>
        When observing real water drops on a vertical surface, small drops tend to stick to the surface,
        while bigger drops of water tend to flow down the surface as gravity overcomes the 
        attractive forces between the drop and the canvas.
        To capture this effect, the amount of water stored in a cell is programmed
        to control the flow of paint in the direction of the external force. To compute the new amount of water in a cell,
        two samples are made in the old water texture. The first sample <TeX>w_1^\prime</TeX> is made on the same location as the cell itself,
        while the second sample <TeX>w_2^\prime</TeX> is made with an offset in the opposite direction of the force acting on the fluid.
        The new amount of water <TeX>w_1</TeX> in the cell is then calculated as
        </p>
        <p className="block-equation">
        <TeX>{waterAdvectionEquation}</TeX>,
        </p>
        <p>
        where <TeX>{fAdv}</TeX> is a function,
        that computes a factor <TeX>\in [0, 1]</TeX> of how much of the contained water that should be transported
        away given the the amount of water in the cell itself.
        The first term in the equation corresponds to the amount of water that remains in the current cell,
        while the second one gathers the incoming water from the neighbor cell. After experimenting with different models, I decided to set <TeX>{fAdv}</TeX> to a monotonically growing function
        implemented using GLSL's <code>smoothstep</code> function, outputting values between 0 and 1:
        </p>

        <pre className="source-code">
        {advectionFactorImplementation}
        </pre>


        <p>Here, both the lower and upper thresholds are user defined constants,
        state how much water that is required for external forces to overcome the static frictional force
        and how much water that is required to achieve maximum flow.</p>

        <p>
        In order to allow for wet pigment to be transported by the water,
        the advection factor is also required when computing the new cell values for wet pigment texture.
        The new wet pigment vector <TeX>{pw1}</TeX> is computed similarly as the water amount.
        Since pigment vectors are additive, we can calculate a cell's new pigment color given the two
        old pigment vectors <TeX>{pw1Prime}</TeX> and <TeX>{pw2Prime}</TeX> (sampled
        on the same locations as <TeX>w_1^\prime</TeX> and <TeX>w_2^\prime</TeX>).
        </p>
        <p className="block-equation">
        <TeX>{wetAdvectionEquation}</TeX>
        </p>

        <h4>Evaporation</h4>
        <p>
        In reality, the water in an aquarelle painting takes quite a while to evaporate.
        The most prominent cause of paint drying out is probably the absorption of water into the canvas,
        allowing the pigment to follow and fixate into the canvas. However, the important result of this
        process is that the amount of water decreases over time, while the pigment amount stays the same.
        </p>
        <p>
        For simplicity, I decided to model this as an evaporation process.
        In each simulation step, the water amount of each cell is decreased by a constant factor.
        The idea is childishly simple to implement, but yet gives visually convincing results: the most prominent
        being that water drops slow down over time, as their water content decreases.
        </p>
        <p>Mathematically, this can be written as</p>
        <p className="block-equation">
        <TeX>{evaporationEquation}</TeX>
        </p>
        <p>where <TeX>w</TeX> is the new water amount, <TeX>w^\prime</TeX> is the old water amount, and <TeX>v_e</TeX> is a global evaporation rate.</p>

        <h4>Drying</h4>
        <p>
        While pigment that are dissolved in water is transported along with the water,
        pigment that have been absorbed by the canvas is less likely to get flushed away by the water.
        In reality, a canvas is a quite rough surface which makes the absorption non-uniform. 
        To achieve these effects, each simulation step contains a simple algorithm that
        transports pigment from the wet texture into the dry one, where no advection takes place.

        The factor <TeX>{fDrying}</TeX> describing how much of the pigment to remove from the wet texture
        and insert into the dry one during a simulations step, is calculated as
        </p>

        <p className="block-equation">
        <TeX>{dryingRateEquation}</TeX>,
        </p>

        <p>where <TeX>{vDrying}</TeX> is a global drying rate, and <TeX>\epsilon</TeX> is a deterministic noise function used
        to modulate the drying over the canvas giving each grid cell (with coordinates <TeX>(x, y)</TeX>) a unique absorption coefficient, making the canvas less "perfect" and more realistic.
        The noise function is borrowed from Stefan Gustavsson's and Ashima Art's <a href="https://github.com/stegu/webgl-noise">implementation</a> of <a href="http://www.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf">simplex noise</a>. 
        </p>
      
        <p className="block-equation">
        <TeX>{dryingEquationWet}</TeX>
        </p>
        <p className="block-equation">
        <TeX>{dryingEquationDry}</TeX>
        </p>
        
        <p>
        A value of <TeX>{fDryingEq1}</TeX> would mean that all the pigment is moved to the dry texture,
        while <TeX>{fDryingEq0}</TeX> would mean that the system remains unchanged.
        </p>
        
        <h4>Diffusion</h4>
        <p>
        In a real aquarelle painting, dissolved color pigments easily mix with pigments in their vicinity.
        Water levels also tend to smooth out, so that water drops attain round shapes when surface
        tension and other forces set in.
        While real surface tension is relatively difficult to model, it is possible to achieve a similar effect by 
        applying diffusion on the water texture and the wet pigment texture.
        </p>

        <p>
        For each cell, four diffusion factors <TeX>{fDiffusion}</TeX> are computed for each of its four neighbor cells <TeX>i</TeX> -
        (above, below, to the left and to the right). The diffusion factors are given by
        </p>

        <p className="block-equation">
        <TeX>{diffusionFactorEquation}</TeX>,
        </p>

        <p>
        where <TeX>w^\prime</TeX> is the water content of the current cell,
        <TeX>w_i^\prime</TeX> is the water content of the neighboring one and <TeX>{vDiffusion}</TeX> is a global diffusion constant.
        </p>
        <p>
        The diffusion factors are used to determine how much water and pigments that are exchanged between the two neighboring cells.
        In a simulation step, the new water amount <TeX>w</TeX> and the new wet pigment vector <TeX>p_w</TeX> are calculated as
        </p>
        <p className="block-equation"><TeX>{diffusionWaterEquation}</TeX></p>
        <p>and</p>
        <p className="block-equation"><TeX>{diffusionPigmentEquation}</TeX>.</p>
        
        <h4>Combining the components</h4>
        <p>In the above text, the four individual simulation components (evaporation, advection, diffusion and drying)
        have been described individually. New water values <TeX>w</TeX> and pigment vectors <TeX>{pw}</TeX>, <TeX>{pd}</TeX> have been expressed as functions of previous state.
        But what previous state? In which order the operations executed?
        </p>
        <p>One method would be to perform the operations sequentially in four shader passes per texture pair.
        In total, that would mean <TeX>3 \cdot 4 = 12</TeX> shader passes per simulation step.
        A possible order of operations would be 1) evaporation, 2) advection, 3) drying, 4) diffusion.
        Since an important goal is to make the simulation resource efficient,
        in order not to occupy the whole GPU and CPU while the user is <em>just browsing a website</em>, it would 
        be beneficial if to minimize the number of shader passes. 
        </p>
        <p>
        It would be desirable to merge the four simulation components into one shader pass per texture pair. 
        However, to get the same results as if the operations were to be carried out as separate shaders,
        the diffusion step would need access to the output of the drying step,
        which would in turn need the output from the advection step,
        which in turn would need the output from the advection.
        Due to the nature of fragment shaders, to do this correctly, the program would have to sample more cells
        and apply the substeps to each of them, instead of tracking the state of only one cell.
        Texture samples are also relatively expensive, so if they could be avoided, that would speed up the simulation.
        </p>
        <p>
        Since the main goal is not to make visually convincing graphics, rather than a correct physical simulation,
        some simplifications are made in order to minimize texture accesses. When applying the diffusion step,
        the algorithm operates on advected values for the active cell itself, but for neighbor cells, advection is ignored.
        This decreases the required texture samples by four in both the water simulation and the wet pigment simulation, without causing a noticable visual difference.
        </p>

        <h3>Adding paint to the canvas</h3>
        <p>When using a brush to paint on a surface, color is not only released from the brush:
        it also gets picked up from the canvas and dragged along with the brush strokes.
        Modelling this would require a relatively sophisticated simulation.
        Drip painting on the other hand can be modelled in a much simpler way,
        by just adding water and pigment to the canvas.
        I decided to implement this, and save other brush techniques for future work.

        </p>
        <h4>Modelling drip painting</h4>
        <p>
        The act of adding paint to the canvas is implemented using two shader passes:
        one writing to the water texture and one writing to the wet pigment texture.
        The dry texture is not affected directly, but only gets filled with pigment thanks to the drying process described earlier.
        </p>
        <p>
        When dripping paint on a canvas, stains usually come in clusters.
        To create a stain, a set of points and sizes are generated with JavaScript's built in <code>Math.rand()</code> function.
        The set of points and sizes are fed in as a uniform vec2 array and a unfiform float array to the GPU.
        For each cell, a fragment shader is picking out the closest of these points, normalized by point size, using linear search.
        The amount of water and pigment to add to each cell on the canvas is calculated using GLSL's <code>smoothstep</code> function.

        </p>
        <pre className="source-code">
        float amount = smoothstep(stainSize, stainSize * 0.5, distance);
        </pre>
        <p>
        Apart from being in different positions and sizes,
        stains can also be applied with different amount of water and pigment, and with different colors.

        </p>

        <div className="stains-page-widget-small">
        <StainsComponent brush="stainsBrush" brushDemo fuzziness={0} backgroundColor={[0.98, 0.98, 0.98]}/>
        </div>
        <p className="caption">
        Along each row, the stain size increases. For each stain, the amount of water and pigment increases.
        On the top row, the amount of water has increased to the level required
        for gravity to successfully pull the paint downwards. 
        </p>

        <h4>Fuzzy drops</h4>

        <p>
        In reality, stains may be quite round in their shape, but they are never perfectly circular.
        To achieve this, the closest distance to a stain point is modulated using the same noise function that was used to modulate the drying: simplex noise.
        </p>

        <div className="stains-page-widget-small">
        <StainsComponent brush="stainsBrush" brushDemo fuzziness={0.4} backgroundColor={[0.98, 0.98, 0.98]}/>
        </div>
        <p className="caption">
        Noise is applied to the distance to the closest point, creating a more realistic result. 
        </p>

        <h3>Selecting colors</h3>
        <img src="input_original_800.png" className="hang-right" style={{width: '400px', height: '400px'}}></img>
        <p>
        As an experiment, I implemented a feature to allow the library select colors from existing images,
        essentially making it possible to feed in a photo and turn it into a drip painting.
        The image is fed into wet pigment shader pass for adding stains,
        and colors are sampled from the center point of all the points in a stain cluster.
        </p>

        <p>
        This photo is taken from a path along Göta Kanal.
        I manually masked out the water in the photo,
        and instructed the algorithm to put more water in the color when painting in those areas.
        </p>
        <div className="stains-page-widget-square">
        <StainsComponent src="input.png" randomPaint mousePaint brushSize={15} fuzziness={0.4} backgroundColor={[0.98, 0.98, 0.98]}/>
        </div>


        <h3 style={{clear: 'both'}}>Rendering the model to the screen</h3>
        <p>
        To render the data to the screen, the contents of the dry and wet pigment
        are both taken into account. The water is considered invisible and does not
        contribute to the final rendering other than dictating the flow of pigment during the simulation step.
        The final color vector <TeX>{finalColor}</TeX> is given by the blending equation
        </p>
        <p className="block-equation">
        <TeX>{finalColorEquation}</TeX>
        </p>
        <p>
        where <TeX>{pw}</TeX> is the wet pigment vector, and <TeX>{pd}</TeX> is the dry pigment vector.
        </p>
        <h3>To wrap up</h3>
        <p>I think this project demonstrates how relatively simple physically based simulation 
        can be combined with procedural methods for images, such as noise, to create visually convincing results.
        When working on this, a lot of different ideas of future improvements and use cases have popped up in my head:
        How about a full game with graphics based on this style? Or some kind of interactive movie?
        </p>

        <p>If you're interested in using the stuff in your own project,
        the source code is freely available on <a href="https://github.com/emiax/stains">Github</a> under the MIT license.
        </p>
    </article>
    </div>
    )
  }
};
