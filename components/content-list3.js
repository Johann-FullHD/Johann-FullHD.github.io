import React from 'react'

import PropTypes from 'prop-types'

import './content-list3.css'

const ContentList3 = (props) => {
  return (
    <div className="content-list3-container thq-section-padding">
      <div className="content-list3-max-width thq-section-max-width thq-flex-column">
        <div className="content-list3-content thq-flex-column">
          <ul>
            <li className="thq-flex-column list-item">
              <h2 className="content-list3-heading1 thq-heading-2">
                {props.heading1}
              </h2>
              <p>{props.content1}</p>
              <ul className="content-list3-ul1 thq-flex-column">
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading2}</h3>
                  <p>{props.content2}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading3}</h3>
                  <p className="thq-body-small">{props.content3}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading4}</h3>
                  <p className="thq-body-small">{props.content4}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading5}</h3>
                  <p className="thq-body-small">{props.content5}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading6}</h3>
                  <p className="thq-body-small">{props.content6}</p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="content-list3-content1 thq-body-small content-list3-content1 thq-flex-column">
          <ul>
            <li className="thq-flex-column list-item">
              <h2 className="content-list3-heading7 thq-heading-2">
                {props.heading7}
              </h2>
              <p className="content-list3-content7 thq-body-small">
                {props.content7}
              </p>
              <ul className="content-list3-ul3 thq-flex-column">
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading8}</h3>
                  <p className="thq-body-small">{props.content2}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading9}</h3>
                  <p className="thq-body-small">{props.content9}</p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="thq-body-small content-list3-content2 thq-flex-column">
          <ul>
            <li className="thq-flex-column list-item">
              <h2 className="content-list3-heading10 thq-heading-2">
                {props.heading10}
              </h2>
              <p className="content-list3-content10 thq-body-small">
                {props.content10}
              </p>
              <ul className="content-list3-ul5 thq-flex-column">
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading11}</h3>
                  <p className="thq-body-small">{props.content11}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading12}</h3>
                  <p className="thq-body-small">{props.content12}</p>
                </li>
                <li className="list-item">
                  <h3 className="thq-heading-3">{props.heading13}</h3>
                  <p className="thq-body-small">{props.content13}</p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

ContentList3.defaultProps = {
  heading3: 'About Us',
  heading11: 'General',
  heading9: 'Products and Services',
  content2:
    'Find the perfect plan for your needs with our transparent pricing information.',
  content7:
    'Lorem ipsum dolor sit amet. Vel dolores illum est aperiam quis nam voluptatem quia et omnis autem qui dolore ullam sed fugiat cumque! Qui accusamus assumenda et molestias eius et error sunt. Id recusandae nostrum ea officiis voluptatem in nisi consequatur sed quia tenetur sit alias molestias qui illum soluta.  Est nesciunt perferendis eum sint rerum 33 cupiditate dolorem id corrupti laboriosam ut debitis veniam ut ipsam fugit vel sunt consequatur. Et nobis quasi et cumque adipisci aut molestiae eligendi quo inventore dicta ea suscipit sequi sed veritatis nemo.',
  content4:
    'Reach out to us for any inquiries or support. We are here to help!',
  heading13: 'Refunds',
  content11:
    'Lorem ipsum dolor sit amet. Nam nihil facilis sit consequuntur internos qui minima rerum ut molestias laudantium aut iusto deserunt. Aut voluptatibus excepturi qui officia laudantium est repellendus tempore hic sunt debitis.  Ut galisum tempore in enim fugit eum pariatur possimus est tenetur nemo et sint sint et dolores Quis. Aut illum perspiciatis rem architecto culpa et fuga aliquid. Est omnis praesentium ut nisi internos rem quod totam et similique quis. Est tempore cumque aut recusandae labore qui error molestiae et possimus quia!  Eum Quis asperiores non nihil tempora qui quia voluptatem aut aspernatur aspernatur aut asperiores labore et sapiente quaerat qui suscipit quia. Ea nesciunt iste aut temporibus culpa sit dignissimos quaerat eum architecto voluptatum et nemo velit At harum harum.',
  heading10: 'Refund Policy',
  content5:
    'Access our privacy policy, terms of service, and manage your cookie settings here.',
  content9:
    'Lorem ipsum dolor sit amet. Est vitae blanditiis ab aliquam tempore aut ipsam iusto in sunt repellat ex voluptatum inventore ab facilis galisum ea consequatur consequuntur. Ab voluptas voluptatem eum consequatur aspernatur non laboriosam atque est labore asperiores a neque quos.  Ea nemo modi hic dicta saepe et veritatis maiores At praesentium aliquid. Sed dolores architecto non doloribus quia eos consectetur commodi non tenetur vitae est neque omnis.  Non perspiciatis velit At aliquam rerum ut officiis ipsa id minima eius ut sapiente nobis et nemo neque. Aut maiores tempora in officiis sunt eum voluptatem tenetur sit iste reprehenderit ea nisi dolor. Ea impedit omnis ad internos autem ut esse sunt ad saepe maiores vel perferendis veritatis. Ex magni fugiat ut reprehenderit laudantium sit galisum ipsam eos tempora doloribus sed accusantium nobis eum praesentium quod.',
  content10:
    'Lorem ipsum dolor sit amet. Vel dolores illum est aperiam quis nam voluptatem quia et omnis autem qui dolore ullam sed fugiat cumque! Qui accusamus assumenda et molestias eius et error sunt. Id recusandae nostrum ea officiis voluptatem in nisi consequatur sed quia tenetur sit alias molestias qui illum soluta.  Est nesciunt perferendis eum sint rerum 33 cupiditate dolorem id corrupti laboriosam ut debitis veniam ut ipsam fugit vel sunt consequatur. Et nobis quasi et cumque adipisci aut molestiae eligendi quo inventore dicta ea suscipit sequi sed veritatis nemo.',
  heading5: 'Legal Information',
  content1:
    'Explore our wide range of features to create a unique and dynamic website.',
  heading12: 'Damages and issues',
  heading6: 'Links',
  heading2: 'Pricing Information',
  heading4: 'Contact Us',
  content13:
    'Lorem ipsum dolor sit amet. Est vitae blanditiis ab aliquam tempore aut ipsam iusto in sunt repellat ex voluptatum inventore ab facilis galisum ea consequatur consequuntur. Ab voluptas voluptatem eum consequatur aspernatur non laboriosam atque est labore asperiores a neque quos.  Ea nemo modi hic dicta saepe et veritatis maiores At praesentium aliquid. Sed dolores architecto non doloribus quia eos consectetur commodi non tenetur vitae est neque omnis.  Non perspiciatis velit At aliquam rerum ut officiis ipsa id minima eius ut sapiente nobis et nemo neque. Aut maiores tempora in officiis sunt eum voluptatem tenetur sit iste reprehenderit ea nisi dolor. Ea impedit omnis ad internos autem ut esse sunt ad saepe maiores vel perferendis veritatis. Ex magni fugiat ut reprehenderit laudantium sit galisum ipsam eos tempora doloribus sed accusantium nobis eum praesentium quod.',
  heading8: 'General Terms and Conditions',
  heading1: 'Features',
  content6:
    'Explore more resources and helpful links related to website building and design.',
  content3: 'Learn more about our company and the team behind the platform.',
  content12:
    'Lorem ipsum dolor sit amet. Est vitae blanditiis ab aliquam tempore aut ipsam iusto in sunt repellat ex voluptatum inventore ab facilis galisum ea consequatur consequuntur. Ab voluptas voluptatem eum consequatur aspernatur non laboriosam atque est labore asperiores a neque quos.  Ea nemo modi hic dicta saepe et veritatis maiores At praesentium aliquid. Sed dolores architecto non doloribus quia eos consectetur commodi non tenetur vitae est neque omnis.  Non perspiciatis velit At aliquam rerum ut officiis ipsa id minima eius ut sapiente nobis et nemo neque. Aut maiores tempora in officiis sunt eum voluptatem tenetur sit iste reprehenderit ea nisi dolor. Ea impedit omnis ad internos autem ut esse sunt ad saepe maiores vel perferendis veritatis. Ex magni fugiat ut reprehenderit laudantium sit galisum ipsam eos tempora doloribus sed accusantium nobis eum praesentium quod.',
  heading7: 'Terms of service',
}

ContentList3.propTypes = {
  heading3: PropTypes.string,
  heading11: PropTypes.string,
  heading9: PropTypes.string,
  content2: PropTypes.string,
  content7: PropTypes.string,
  content4: PropTypes.string,
  heading13: PropTypes.string,
  content11: PropTypes.string,
  heading10: PropTypes.string,
  content5: PropTypes.string,
  content9: PropTypes.string,
  content10: PropTypes.string,
  heading5: PropTypes.string,
  content1: PropTypes.string,
  heading12: PropTypes.string,
  heading6: PropTypes.string,
  heading2: PropTypes.string,
  heading4: PropTypes.string,
  content13: PropTypes.string,
  heading8: PropTypes.string,
  heading1: PropTypes.string,
  content6: PropTypes.string,
  content3: PropTypes.string,
  content12: PropTypes.string,
  heading7: PropTypes.string,
}

export default ContentList3
