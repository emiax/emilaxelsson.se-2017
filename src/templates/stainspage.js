import React from 'react';
import { Link } from 'react-router';
import TeX from 'react-components/js/tex.jsx';
import StainsPageHeader from './stainspageheader';
import NavBar from './navbar';

export default React.createClass({
  render() {
    let fAdv = "f_{\\text{adv}}";
    let fDrying = "f_{\\text{dry}}";
    let fDryingEq0 = "f_{\\text{dry}} = 0";
    let fDryingEq1 = "f_{\\text{dry}} = 1";
    let vDrying = "v_{\\text{dry}}";
    let fDiffusion = "f_{\\text{dif}_i}";
    let vDiffusion = "v_{\\text{dif}}";
    let waterAdvectionEquation = "w_1 = w_1^\\prime \\cdot (1 - " + fAdv + "(w_1^\\prime)) + w_2^\\prime \\cdot " + fAdv + "(w_2^\\prime)";
    let wetAdvectionEquation = "p_1 = p_1^\\prime \\cdot (1 - " + fAdv + "(w_1^\\prime)) + p_2^\\prime \\cdot " + fAdv + "(w_2^\\prime)";
    let advectionFactorImplementation = [
      'float advectionFactor(waterAmount)\n' +
      '  return smoothstep(0.2, 0.8, water) * 0.8;\n' +
      '}'];
    let dryingEquation = fDrying + ' = ' + vDrying + ' \\cdot (1 + \\epsilon(x, y))';
    let diffusionFactorEquation = fDiffusion + ' = \\text{min}(' + vDiffusion + '\\cdot w^\\prime \\cdot w_i^\\prime, \\frac{1}{4})';

    let diffusionWaterEquation = 'w = (1 - \\sum_{i} ' + fDiffusion + ') \\cdot w^\\prime + \\sum_{i} ' + fDiffusion + 'w^\\prime_i';
    let diffusionPigmentEquation = 'p_w = (1 - \\sum_{i} ' + fDiffusion + ') \\cdot p_w^\\prime + \\sum_{i} ' + fDiffusion + 'p_{w_i}^\\prime';

    return (
      <div>
      <NavBar/>
      <StainsPageHeader/>
      <article>
        <h2>Stains: Interactive art in the browser</h2>
        <p>
        <em>Stains</em> is a JavaSript/WebGL library that I created to mimic the
        visual appearance and behaviour of aquarelle on a canvas. The library, which can
        procedurally generate aquarelle paintings is used to create
        artistic-looking elements for my personal website without having to spend hours on manual animation 
        while also allowing for visitors to interact with the content.
        It does not necessarily serve a much deeper purpose than simply looking visually appealing,
        but I also think it is an interesting proof-of-concept for a style of computer graphics,
        that could be used in other contexts, such as digital storytelling,
        computer games, VJing or other forms of interactive art.
        </p>

        <h3>Designing the model</h3>
        <p>
        With WebGL, the web browser has lately become a very capable platform for computer graphics, but it is still limited
        in comparison to native applications. Also, while it is reasonable to expect a 3D computer game
        to use the full potential of a computer's performance, it may not be as acceptable for a web site
        to drain all the available resources and make other applications run slow.
        There are sophisticated physical models out there that accurately approximate the behavior of a real fluid, but in order to create
        efficient real-time graphics applications, it is sometimes a good idea to cheat. For example,
        while it still makes sense to base the model on physical laws, modelling surface tension and pressure accurately is not 
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
        <li>Simple advection (movement) of water due to external forces like gravity</li>
        <li>Evaporation of water</li>
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

        <p>This means that a total of nine scalar values per grid cell are used.
        In WebGL this is represented as two <TeX>RGBA</TeX>-textures and one scalar texture.
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
        Once the new state of the simulation has been stored in a set of textures, the old texture set can be reused for the next simulation step.
        This means that in total, one canvas requires four <TeX>RGBA</TeX>-textures and two scalar ones. 
        </p>


        <h3>Simulating paint on the canvas</h3>
        <p>
        The image below illustrates the flow of data between the textures. 

        </p>
        <svg viewBox="0 0 410 310">
          <use xlinkHref="mechanism.svg#mechanism"></use>
        </svg>

        <p>
        The WebGL 1.0 standard does not support multiple render targets,
        meaning that a framebuffer object can only have one color attachment.
        Hence, the implementation divides each simulation step into three shader passes,
        where the first one computes the new water texture,
        the second one computes the new wet pigment texture and
        the third computes the new dry pigment texture.

        To minimize the number of shader program executions in order to maximize performance,
        all the modelled phenomena (advection, evaporation, diffusion and drying)
        are merged into one shader pass per output texture.</p>

        <svg viewBox="0 0 280 100">
          <use xlinkHref="shaderpasses.svg#shaderpasses"></use>
        </svg>


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
        that computes a factor <TeX>\in [0, 1]</TeX> of how much of the conatained water that should be transported
        away given the the amount of water in the cell itself. <TeX>{fAdv}</TeX> was chosen to be a monotonically growing function
        implemented in GLSL as 
        </p>

        <pre className="source-code">
        {advectionFactorImplementation}
        </pre>

        <p>
        The above method allows water to enter the cell, as well as exit into the next one.
        </p>
        <p>
        In order to allow for wet pigment to be transported by the water,
        the advection factor is also required when computing the new cell values for wet pigment texture.
        The new wet pigment <TeX>p_1</TeX> color is computed similarly as the water amount.
        Since pigment vectors are additive, we can calculate the new pigment color of a cell given the two
        old pigment amounts <TeX>p_1^\prime</TeX> and <TeX>p_2^\prime</TeX>,
        sampled on the same locations as <TeX>w_1^\prime</TeX> and <TeX>w_2^\prime.</TeX>
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

        <h4>Drying</h4>
        <p>
        While pigment that are disolved in water is transported along with the water,
        pigment that have been absorbed by the canvas is less likely to get flushed away by the water.
        In reality, a canvas is a quite rough surface which makes the absorption non-uniform. 
        To achieve these effects, each simulation step contains a simple algorithm that
        transports pigment from the wet texture into the dry one, where no advection takes place.

        The factor <TeX>{fDrying}</TeX> describing how much of the pigment to remove from the wet texture
        and insert into the dry one during a simulations step, is calculated as
        </p>

        <p className="block-equation">
        <TeX>{dryingEquation}</TeX>,
        </p>

        <p>where <TeX>{vDrying}</TeX> is a global "drying speed" constant, and <TeX>\epsilon</TeX> is a deterministic noise function used
        to modulate the drying over the canvas giving each grid cell (with coordinates <TeX>(x, y)</TeX>) a unique absoption coefficient, making the canvas less "perfect" and more realistic.
        The noise function is borrowed from Stefan Gustavsson's and Ashima Art's <a href="https://github.com/stegu/webgl-noise">implementation</a> of <a href="http://www.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf">simplex noise</a>. 

        A value of <TeX>{fDryingEq1}</TeX> would mean that all the pigment is moved to the dry texture,
        while <TeX>{fDryingEq0}</TeX> would mean that the system remains unchanged.</p>
        
        <h4>Diffusion</h4>
        <p>
        In a real aquarelle painting, dissolved color pigments easily mix with pigments in their vicinity.
        Water levels also tend to smooth out, so that water drops attain round shapes when surface
        tension and other forces sets in.
        While real surface-tension is difficult to model, it is possible to achieve a similar effect by 
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
        <TeX>w_i^\prime</TeX> is the water content of the neighnoring one and <TeX>{vDiffusion}</TeX> is a global diffusion constant.
        </p>
        <p>
        The diffusion factors are used to determine how much water and pigment that are exchanged between the two neighboring cells.
        In a simulation step, the new water amount <TeX>w</TeX> and the new wet pigment vector <TeX>p_w</TeX> are calculated as
        </p>
        <p className="block-equation"><TeX>{diffusionWaterEquation}</TeX></p>
        <p>and</p>
        <p className="block-equation"><TeX>{diffusionPigmentEquation}</TeX>.</p>
        


        <h3>Adding paint to the canvas</h3>
        <p>
      
        </p>



        <h3>Rendering the model to the screen</h3>
        

       <h3>TODO</h3>
       <ul>
       <li>Gravity from device orientation</li>
       <li>Add paint manually</li>
       <li>Support different size of stains from 1 render pass</li>
       <li>Distribute stains</li>
       <li>Painted video: only paint differences.</li>


       </ul> 

    </article>
    </div>
    )
  }
});
