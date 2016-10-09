import React from 'react';
import { Link } from 'react-router';
import StainsHeader from './stainsheader'

export default React.createClass({
  render() {
    return (
      <div>
      <StainsHeader/>
      <article>
      <h2>An introduction</h2>

      <p className="intro">
      Hi, I'm Emil. I like being creative, solving technical problems,
      working with computer graphics, designing visualizations, coming up
      with elegant algorithms, interacting with people, playing and recording music,
      and working with web technologies.
      </p>

      <p>
      Currently I am working as a research engineer at Linköping University / Visualization Center C,
      mainly devoting my time to the open source project OpenSpace. I also get to have fun with our dome theatre:
      both developing tech infrastructure and creating movies and interactive content.
      </p>

      <h2>Some of my work</h2>
      <h3>Stains: Procedural aquarelle</h3>      
      <Link to="stains">Stains</Link>

      <h3>OpenSpace and Master's thesis @ NASA</h3>

      <div className="imagetest" style={{width: '400px', height: '400px'}}></div>
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

      <h3>Best Healthcare and Medical Care @ East Sweden Hack 2016</h3>

      <h3>Accessibility @ Spotify</h3>
      
      <div className="imagetest2" style={{width: '200px', height: '200px'}}></div>
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
});
