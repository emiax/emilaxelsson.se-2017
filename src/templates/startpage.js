import React from 'react';
import { Link } from 'react-router';
import StainsComponent from './stainscomponent';
import EaLogoComponent from './ealogocomponent';

export default class extends React.Component {
  render() {
    return (
      <div>
      <div className="start-page-header">
        <StainsComponent src="input4.jpg" brushSize={20} randomPaint mousePaint backgroundColor={[0.98, 0.98, 0.98]}/>
        <EaLogoComponent/>
        <div className="fade-to-white"></div>
      </div>
      <article>
      <h2>Hi, I'm Emil</h2>

      <p className="intro">I'm a creative engineer, based in Norrköping, Sweden.
      I like the places where software and people meet. Luckily, that happens sort of everywhere these days.
      Bring music, visualizations, graphics and great teamwork into the mix, and I'm in my favorite spot.
      </p>

      <p>
      Currently I am working as a research engineer at Linköping University / Visualization Center C,
      mainly devoting my time to the open source project OpenSpace. I also get to have fun with our dome theatre:
      both developing tech infrastructure and creating movies and interactive content.
      </p>

      <h2>Let's talk!</h2>
      <p>
      It's probably easiest to send a message
      on <a href="https://www.facebook.com/nils.emil.axelsson">Facebook</a> or
      to drop an email to <a href="mailto:mail@emilaxelsson.se">mail@emilaxelsson.se</a>.
      You may want to find me on <a href="http://github.com/emiax">Github</a> or <a href="https://www.linkedin.com/in/emiax">LinkedIn</a> as well.
      </p>
      <h2>Some of my work</h2>
      <h3>Stains: Interactive art in the browser</h3>      
      <div src="enlil.jpg" className="hang-right" style={{position: 'relative', width: 400, height: 400}}>
        <StainsComponent src="input2.png" brushSize={10} randomPaint mousePaint backgroundColor={[0.97, 0.97, 0.97]}/>
      </div>
      <p>
        <Link to="stains"><em>Stains</em></Link> is a JavaScript/WebGL library that I created to mimic the
        visual appearance and behaviour of aquarelle on a canvas. The library, which can
        procedurally generate aquarelle paintings is used to create
        artistic-looking elements for my personal website and allow visitors to interact with the content.
        It does not necessarily serve a much deeper purpose than simply looking visually appealing,
        but I also think it is an interesting proof-of-concept for a style of computer graphics,
        that could be used in other contexts, such as digital storytelling,
        computer games, VJing or other forms of interactive art.
      </p>

      <h3>OpenSpace and Master's thesis @ NASA</h3>

      <img src="enlil.jpg" className="hang-left" style={{width: 500, height: 500 * 540/960}}></img>
      <p>
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
      Suspendisse feugiat scelerisque justo, in dignissim mauris.
      Etiam lacinia nibh suscipit nisl imperdiet, eget sagittis sem congue.
      Sed eleifend leo pulvinar lacus tristique elementum. Nulla venenatis lacus id diam feugiat bibendum.
      Maecenas magna diam, ultricies vitae rutrum eu, porta consectetur metus. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Vivamus tempor, justo eu finibus aliquam, turpis nunc ultricies ligula,
      vel mattis leo ligula quis arcu. Fusce fringilla eget nibh at elementum. Etiam felis nunc, euismod id
      sollicitudin at, euismod et metus. Duis sed aliquet justo. Ut viverra eros id faucibus interdum. Vivamus in
      vestibulum nibh.
      </p>

      <h3>Best Healthcare and Medical Care @ ESH2016</h3>
      <img src="esh.jpg" className="hang-right" style={{width: 500, height: 500 * 1322/2048}}></img>
      <p>
      Vivamus quis malesuada nisl. Phasellus volutpat orci ut metus gravida,
      quis varius leo porta. Pellentesque neque diam, consequat et justo sed, finibus pretium dui.
      Aenean pretium massa nec ipsum maximus, vel molestie elit maximus. Nam aliquam libero eget dictum viverra.
      Nam eget quam vitae velit laoreet semper vitae sit amet est. Sed varius erat nec nibh euismod,
      at ornare nisi porttitor. Phasellus suscipit quis ipsum vel tincidunt. Fusce at dignissim nisi,
      sed molestie justo. Proin at varius turpis. Quisque varius, lectus in sodales varius,
      tellus orci consectetur turpis, sit amet rutrum magna metus vel diam. Nunc ut viverra lacus.
      Nam dignissim quis dui ut dapibus. Ut urna mi, convallis nec mi id, maximus posuere enim.
      </p>


      <h3>Accessibility @ Spotify</h3>
      
      <div className="hang-right" style={{width: 200, height: 200}}>
        <svg viewBox="-20 -20 140 140">
          <use xlinkHref="spotify.svg#spotify"></use>
        </svg>
      </div>
      <p>
      Vivamus quis malesuada nisl. Phasellus volutpat orci ut metus gravida,
      quis varius leo porta. Pellentesque neque diam, consequat et justo sed, finibus pretium dui.
      Aenean pretium massa nec ipsum maximus, vel molestie elit maximus. Nam aliquam libero eget dictum viverra.
      Nam eget quam vitae velit laoreet semper vitae sit amet est. Sed varius erat nec nibh euismod,
      at ornare nisi porttitor. Phasellus suscipit quis ipsum vel tincidunt. Fusce at dignissim nisi,
      sed molestie justo. Proin at varius turpis. Quisque varius, lectus in sodales varius,
      tellus orci consectetur turpis, sit amet rutrum magna metus vel diam. Nunc ut viverra lacus.
      Nam dignissim quis dui ut dapibus. Ut urna mi, convallis nec mi id, maximus posuere enim.
      </p>

      <h3>Interaction design and 3D programming @ Spotscale</h3>
      <p>Duis interdum imperdiet ligula quis efficitur. Nam vel metus sed nunc ultrices vulputate.
      Etiam lobortis augue a lobortis mattis. Cras metus ligula, maximus vitae mattis sit amet,
      consequat sodales odio. Nulla non diam maximus, laoreet nisi vel, cursus lectus. Donec posuere
      sodales diam sed blandit. Ut tincidunt molestie semper.</p>


      <h3>Knapsack, iOS Game prototype</h3>

      <p>
      Cras feugiat enim vel viverra luctus. Pellentesque viverra nisi at justo elementum sollicitudin.
      Mauris hendrerit sapien tellus, vel suscipit dolor cursus eu. Nullam sit amet posuere orci, pretium ullamcorper
      diam. Praesent commodo leo ut risus efficitur, eu tristique mauris mattis. In hac habitasse platea dictumst.
      Proin non auctor tellus. Curabitur pretium sodales hendrerit. Ut non consectetur urna. In a metus ut quam
      tincidunt condimentum vitae ac risus. Nulla consequat ultrices velit, tincidunt tristique ipsum maximus tempor.
      Nulla vehicula pharetra neque non aliquet. Phasellus commodo pretium est. Duis sagittis id arcu sed tristique
      </p>

      <h3>Continuous</h3>
      <p>A concept for visualizing math in the browser.</p>

      <h3>The future of Norrköping: Dome movie production</h3>

      <h3>Software intern @ Configura</h3>
      </article>
      </div>
      );
    }
};
