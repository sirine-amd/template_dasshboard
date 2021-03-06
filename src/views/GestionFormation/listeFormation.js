import { cilPencil, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'
import { editFormation, nombre_candidatsParFormation } from 'src/services/FormationService'
import {
  CCard,
  CPagination,
  CPaginationItem,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
} from '@coreui/react'
import { uploadfile, getfile } from 'src/services/fileService'

import React, { useEffect, useState } from 'react'
import photo1 from 'src/assets/images/Software-development.jpg'
import 'src/views/GestionFormation/listeFormation.css'
import { getFormations } from 'src/services/FormationService'
import { Modal, Button } from 'react-bootstrap'
import AjoutForm from 'src/views/GestionFormation/AjouterFormation'
import { DeleteFormation } from 'src/services/FormationService'
import { getFormation, ChangerEtatFormation } from 'src/services/FormationService'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ListeFormation = () => {
  let [images, setimages] = useState([])

  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(3)
  const [NextPage, setNextPage] = useState(currentPage + 1)
  const [PreviewsPage, setPreviewsPage] = useState(1)
  const [activeNumber, setactiveNumber] = useState(1)
  const [selectValue, setselectValue] = useState('3')
  const [bool, setBool] = useState(false)
  const [boolarchive, setBoolarchive] = useState(false)
  const [etat, setEtat] = useState('Non archivé')
  const [etat2, setEtat2] = useState('Non archivé')

  // Formulaire d'ajout
  const [validated, setValidated] = useState(false)
  const [id, setId] = useState('')
  const [titre, setTitre] = useState('')
  const [titre2, setTitre2] = useState('')
  const [categorie, setCategorie] = useState('Data Analyst')
  const [description, setDescription] = useState('')
  const [categorie2, setCategorie2] = useState('Data Analyst')
  const [description2, setDescription2] = useState('')
  const [value, setValue] = useState('yes')
  const [prix, setPrix] = useState('')
  const [prix_organismes_conventiones, setprix_organismes_conventiones] = useState('')
  const [prix2, setPrix2] = useState('')
  const [prix_organismes_conventiones2, setprix_organismes_conventiones2] = useState('')
  const [image, setimage] = useState('')
  const [image2, setimage2] = useState('')
  const [image3, setimage3] = useState('')
  const [nbrcandidats, setNbrcandidats] = useState([])

  const [values, setValues] = useState({
    id: '',
    titre: '',
    categorie: '',
    description: '',
    prix: '',
    prix_organismes_conventiones: '',
    nbrCours: '',
    dateCreation: '',
    auteur: { id: '', authority: {} },
    etat,
    image: {
      id: '',
    },
  })
  function initialiser() {
    setTitre('')
    setCategorie('Data Analyst')
    setDescription('')
    setPrix('')
    setValidated(false)
    setimage('')
  }
  function Notification_tailleDescription() {
    Swal.fire({
      icon: 'error',
      title: 'Taille description',
      text: 'La taille de la description doit être au minimum 50 caractères',
    })
  }
  function Notification_Succees() {
    Swal.fire('Succès!', 'La formation a été modifié avec succès', 'success')
  }
  function Notification_NonVide() {
    Swal.fire({
      icon: 'error',
      title: 'Champs requis',
      text: 'Tous les champs doivent être remplis',
    })
  }

  function Notification_failure() {
    Swal.fire({
      icon: 'error',
      title: 'Problème',
      text: 'un problème dans la modification',
    })
  }
  //modification
  function getformationById(id) {
    console.log('id', id)
    setId(id)
    getFormation(id)
      .then((response) => {
        //setData to the form
        setTitre(response.data.titre)
        setCategorie(response.data.categorie)
        setDescription(response.data.description)
        setPrix(response.data.prix)
        setEtat(response.data.etat)
        setTitre2(response.data.titre)
        setCategorie2(response.data.categorie)
        setDescription2(response.data.description)
        setPrix2(response.data.prix)
        setprix_organismes_conventiones(response.data.prix_organismes_conventiones)
        setprix_organismes_conventiones2(response.data.prix_organismes_conventiones)
        setEtat2(response.data.etat)
        values.image.id = response.data.image.id
        getfile(response.data.image.id)
          .then((response2) => {
            setimage(URL.createObjectURL(response2.data))
          })
          .catch((e) => {})
        setimage2(image)
        setimage3(image)

        //set les valeurs dans lobjet de lupdate pour qu'il ne soient pas null
        values.dateCreation = response.data.dateCreation
        values.auteur.id = response.data.auteur.id
        values.auteur.authority = response.data.auteur.authority
        values.nbrCours = response.data.nbrCours
      })
      .catch((e) => {})
  }
  function Notification_photo() {
    Swal.fire({
      icon: 'error',
      title: 'Photo',
      text: 'Il faut choisir une photo',
    })
  }
  function aucune_modification() {
    Swal.fire({
      icon: 'error',
      title: 'Photo',
      text: 'y a aucune modification',
    })
  }
  function handleSubmitMdf(event) {
    console.log('titre', titre)
    console.log('titre2', titre2)
    console.log('categorie', categorie)
    console.log('categorie2', categorie2)
    console.log('prix', prix)
    console.log('prix2', prix2)
    console.log('etat', etat)
    console.log('etat2', etat2)
    console.log('image', image)
    console.log('image2', image2)
    /*     if (
      titre === titre2 &&
      categorie === categorie2 &&
      image === image2 &&
      prix === prix2 &&
      etat === etat2
    ) {
      aucune_modification()
    } */
    if (
      titre === '' ||
      categorie === '' ||
      description === '' ||
      prix === '' ||
      etat === '' ||
      prix_organismes_conventiones === ''
    ) {
      Notification_NonVide()
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
    } else if (description.length < 50) {
      Notification_tailleDescription()
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
    } /* else if (image != image2) {
      Notification_photo()
    } */ else {
      setValidated(true)
      values.id = id
      values.titre = titre
      values.categorie = categorie
      values.description = description
      values.prix = prix
      values.prix_organismes_conventiones = prix_organismes_conventiones
      values.etat = etat
      console.log('values', values)
      const formData = new FormData()
      formData.append('file', image2)
      console.log('values', formData)
      if (image2 === image3) {
        console.log('tbdletch')
        editFormation(id, values).then((response) => {
          if (response.status === 200) {
            setValidated(false)
            Notification_Succees()
          } else Notification_failure()
        })
      } else {
        console.log('tbdlt')
        axios({
          method: 'post',
          url: 'http://localhost:8080/file/upload',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(
          function (response) {
            if (response.data !== 0) {
              values.image.id = response.data
              console.log('values', values)
              editFormation(id, values).then((response) => {
                if (response.status === 200) {
                  setValidated(false)
                  Notification_Succees()
                } else Notification_failure()
              })
            } else {
            }
          },
          function (error) {},
        )
      }
    }
  }
  //popup
  const [showAjt, setShowAjt] = useState(false)
  const [showMdf, setShowMdf] = useState(false)

  const handleShowAjt = () => {
    settest(false)
    setShowAjt(true)
  }
  const handleCloseAjt = () => {
    settest(false)
    setShowAjt(false)
  }

  const handleShowMdf = () => setShowMdf(true)
  const handleCloseMdf = () => setShowMdf(false)

  function Archiverformation1(id, item) {
    Swal.fire({
      title: 'Cette formation est ' + item.etat + '! ' + `Voulez vous changez l'état?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'oui',
      denyButtonText: `Non`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        ChangerEtatFormation(id)
          .then(() => {
            Swal.fire('Modification avec succès!', '', 'success')
            setBoolarchive(true)
            setBoolarchive(false)
          })
          .catch((e) => {})
      } else if (result.isDenied) {
        Swal.fire('Pas de changement!', '', 'info')
      }
    })
  }
  function supprimerFormation(id) {
    Swal.fire({
      title: 'Souhaitez-vous supprimer cette formation ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'supprimer',
      denyButtonText: 'non',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        DeleteFormation(id)
          .then((response) => {
            console.log('data', response.data)
            setBool(true)
            setBool(false)
          })
          .catch((e) => {})

        Swal.fire('cette formation a été supprimé avec succès!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Aucune modification ', '', 'info')
      }
    })
  }
  let navigate = useNavigate()
  function Voircours(id, titre) {
    navigate('/GestionFormation/listeFormation/listeCours', {
      state: { state: id, titre: titre },
    })
  }

  function imageHandler(e) {
    setimage2(e.target.files[0])
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setimage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }
  const [test, settest] = useState(false)
  /*getFormation */
  useEffect(() => {
    getFormations()
      .then((response) => {
        response.data.map((item, index) => {
          getfile(item.image.id)
            .then((response2) => {
              settest(true)
              images[item.id] = URL.createObjectURL(response2.data)
              console.log('hello', response2.data)
            })
            .catch((e) => {})
          nombre_candidatsParFormation(item.id)
            .then((response3) => {
              nbrcandidats.push(response3.data)
            })
            .catch((e) => {})
        })
        setPosts(response.data)
      })
      .catch((e) => {})
  }, [showAjt, showMdf, bool, test, boolarchive])
  if (posts.length == 0)
    return (
      <div className="listeFormation">
        <CCard>
          <header className="card-heade">
            <p className="card-header-title">
              <span className="icon">
                <i className="mdi mdi-account-circle"></i>
              </span>
              Les formations
            </p>
            <button className="btn-Aj" onClick={handleShowAjt}>
              <i
                className="flex fa fa-plus-circle"
                aria-hidden="true"
                style={{ marginRight: 10, paddingTop: 5 }}
              ></i>
              Ajouter formation
            </button>
          </header>
          <Modal
            size="lg"
            show={showAjt}
            onHide={handleCloseAjt}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: '#213f77', color: 'white', fontWeight: 'bold' }}
            >
              <CIcon
                icon={cilPencil}
                style={{
                  marginRight: 15,
                }}
              />
              Ajouter formation
            </Modal.Header>{' '}
            <Modal.Body>
              <AjoutForm />
            </Modal.Body>
          </Modal>
          <div>
            <div style={{ height: 50, marginLeft: 15, marginTop: 15 }}>
              Aucune formation n{"'"}est diponible!
            </div>
          </div>
        </CCard>
      </div>
    )
  else {
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage //3
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
    // Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber)
      if (pageNumber < posts.length / postsPerPage) setNextPage(pageNumber + 1)
      if (pageNumber > 1) setPreviewsPage(pageNumber - 1)
    }
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
      pageNumbers.push(i)
    }

    //selcetionner nombre de posts per page
    const handleChange = (event) => {
      console.log(event.target.value)
      setselectValue(event.target.value)
      setpostsPerPage(selectValue)
    }

    return (
      <div className="listeFormation">
        <CCard>
          <header className="card-heade">
            <p className="card-header-title">
              <span className="icon">
                <i className="mdi mdi-account-circle"></i>
              </span>
              Les formations
            </p>
            <button
              href="tutorial-single.html"
              className="btn-Aj"
              onClick={handleShowAjt}
              type="submit"
            >
              <i
                className="flex fa fa-plus-circle"
                aria-hidden="true"
                style={{ marginRight: 10, paddingTop: 5 }}
              ></i>
              Ajouter formation
            </button>
          </header>
          <Modal
            size="lg"
            show={showAjt}
            onHide={handleCloseAjt}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton style={{ color: '#213f77', fontWeight: 'bold' }}>
              <CIcon
                icon={cilPlus}
                style={{
                  marginRight: 15,
                  color: '#213f77',
                  fontWeight: 'bold',
                }}
              />
              Ajouter formation
            </Modal.Header>{' '}
            <Modal.Body>
              <AjoutForm />
            </Modal.Body>
          </Modal>
          {currentPosts.map((item, index) => (
            <div className="tutorial-item mb-6" key={index}>
              <div className="d-flex">
                <div className="img-wrap">
                  <a href="#">
                    <img
                      src={images[item.id]}
                      alt="Image"
                      className="img-fluid"
                      style={{ width: '500px', height: '270px' }}
                    />
                  </a>
                </div>
                <div className="it-cont">
                  <h3>
                    <a href="#">Formation: {item.titre}</a>
                  </h3>
                  {/* <p>{item.description.substr(1, 60)}...</p> */}
                  <div style={{ marginBottom: 12 }}>
                    <i
                      className="fa fa fa-money"
                      style={{ color: '#3399ff', marginRight: 14 }}
                      aria-hidden="true"
                    ></i>
                    <span className="info-det">Prix:</span>
                    <span className="info-det" style={{ marginLeft: 170 }}>
                      {item.prix} Dt
                    </span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <i
                      className="fa fa fa-money"
                      style={{ color: '#3399ff', marginRight: 14 }}
                      aria-hidden="true"
                    ></i>
                    <span className="info-det">Prix pour les organismes </span>
                    <span className="info-det" style={{ marginLeft: 20 }}>
                      {item.prix_organismes_conventiones} Dt
                    </span>
                    <br></br>
                    <span className="info-det" style={{ marginLeft: '32px' }}>
                      conventionés:
                    </span>
                  </div>
                  <div className="meta">
                    <div style={{ marginBottom: 12 }}>
                      {item.auteur === null ? (
                        <span></span>
                      ) : (
                        <span>
                          <i
                            className="fa fa-user-circle"
                            style={{ color: '#3399ff', marginRight: 14 }}
                            aria-hidden="true"
                          ></i>
                          <span className="info-det">Créer par:</span>
                          <span className="info-det" style={{ marginLeft: 135 }}>
                            {item.auteur.nom} {item.auteur.prenom}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <i
                        className="fa fa-list-alt"
                        style={{ color: '#3399ff', marginRight: 14 }}
                        aria-hidden="true"
                      ></i>
                      <span className="info-det">Catégorie:</span>
                      <span className="info-det" style={{ marginLeft: 130 }}>
                        {item.categorie}
                      </span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <i
                        className="fa fa-users"
                        style={{ color: '#3399ff', marginRight: 8 }}
                        aria-hidden="true"
                      ></i>
                      <span className="info-det">Candidats inscrits:</span>
                      <span className="info-det" style={{ marginLeft: 77 }}>
                        {nbrcandidats[index]} Candidats
                      </span>
                    </div>
                    <div>
                      <span className="mr-2 mb-2">Date de publication: {item.dateCreation}</span>
                      <p className="mr-2 mb-2">Dérnière date de modfication: {item.dateMdf}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      Voircours(item, item.titre)
                    }}
                    className="btn-plus"
                  >
                    Voir cours
                  </button>
                </div>
              </div>
              <div className="buttons">
                <button
                  className="btn-Modf custom-btn"
                  title="Modifier"
                  onClick={() => {
                    getformationById(item.id)
                    handleShowMdf()
                  }}
                >
                  <i className="far fa-edit fa-2x"></i>
                </button>
                <Modal
                  size="lg"
                  show={showMdf}
                  onHide={handleCloseMdf}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton style={{ color: '#213f77', fontWeight: 'bold' }}>
                    <CIcon
                      icon={cilPencil}
                      style={{
                        marginRight: 15,
                      }}
                    />
                    Modifier une formation
                  </Modal.Header>{' '}
                  <Modal.Body>
                    {/* <AjoutForm formation={formation} /> */}
                    <CCard>
                      <CForm
                        className="row g-3 needs-validation"
                        noValidate
                        validated={validated}
                        style={{
                          paddingLeft: 15,
                          paddingRight: 20,
                          paddingTop: 15,
                          paddingBottom: 15,
                        }}
                      >
                        <CCol md={6}>
                          <CFormLabel style={{ fontWeight: 'bold' }} htmlFor="validationCustom01">
                            Titre
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            id="validationCustom01"
                            defaultValue=""
                            required
                            value={titre}
                            onChange={(e) => {
                              setTitre(e.target.value)
                            }}
                          />
                          <CFormFeedback invalid>Titre est requis</CFormFeedback>
                        </CCol>

                        <CCol md={6}>
                          <CFormLabel style={{ fontWeight: 'bold' }} htmlFor="validationCustom04">
                            Catégorie
                          </CFormLabel>
                          <CFormSelect
                            id="validationCustom04"
                            value={categorie}
                            onChange={(e) => {
                              setCategorie(e.target.value)
                            }}
                            defaultValue="Data Analyst"
                          >
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                            <option value="UX Designer">UX Designer</option>
                            <option value="development mobile">development mobile</option>
                            <option value="IT And Software">IT &amp; Software</option>
                          </CFormSelect>
                          <CFormFeedback invalid>
                            Vous devez séléctionner une Catégorie.
                          </CFormFeedback>
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel style={{ fontWeight: 'bold' }} htmlFor="validationCustom01">
                            Prix
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            id="validationCustom01"
                            placeholder="0.00"
                            required
                            value={prix}
                            onChange={(e) => {
                              setPrix(e.target.value)
                            }}
                          />
                          <CFormFeedback invalid>Prix est requis</CFormFeedback>
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel style={{ fontWeight: 'bold' }} htmlFor="validationCustom01">
                            prix_organismes_conventiones
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            id="validationCustom01"
                            placeholder="0.00"
                            required
                            value={prix_organismes_conventiones}
                            onChange={(e) => {
                              setprix_organismes_conventiones(e.target.value)
                            }}
                          />
                          <CFormFeedback invalid>
                            prix_organismes_conventiones est requis
                          </CFormFeedback>
                        </CCol>
                        <CCol md={6}>
                          <div
                            style={{
                              'text-align': 'center',
                            }}
                          >
                            <img src={image} alt="photo" width="300" height="180" />
                          </div>
                          <div className="field-body mx-auto" style={{ 'margin-top': '15px' }}>
                            <div
                              className="field file mx-auto"
                              style={{
                                'border-radius': '30px',
                                color: 'white',
                                borderColor: 'white',
                                width: '150px',
                              }}
                            >
                              <label
                                className="upload control mx-auto"
                                style={{
                                  Float: 'center',
                                  align: 'center',
                                  'border-radius': '30px',
                                  color: 'white',
                                  borderColor: 'white',
                                  width: '150px',
                                }}
                              >
                                <a
                                  className="button blue"
                                  style={{
                                    color: '#213f77',
                                    'background-color': 'white',
                                    borderColor: '#213f77',
                                    width: '150px',
                                    border: '2.5px solid #213f77',
                                    paddingLeft: 5,
                                  }}
                                >
                                  Choisir une photo
                                </a>
                                <CFormInput
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg"
                                  onChange={(value) => imageHandler(value)}
                                  name="image"
                                />{' '}
                              </label>
                            </div>
                          </div>
                        </CCol>
                        {etat == 'Non archivé' ? (
                          <CCol md={6}>
                            <CFormLabel htmlFor="validationCustom01" style={{ fontWeight: 'bold' }}>
                              Spécifier l{"'"}etat:
                            </CFormLabel>

                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios1"
                              value="Non archivé"
                              label="Non archivé"
                              onChange={(e) => {
                                setEtat(e.target.value)
                              }}
                              defaultChecked
                            />
                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="Archivé"
                              label="Archivé"
                              onChange={(e) => {
                                setEtat(e.target.value)
                              }}
                            />
                            <CFormLabel
                              style={{ fontWeight: 'bold' }}
                              htmlFor="exampleFormControlTextarea1"
                            >
                              Déscription (min 50 caractères)
                            </CFormLabel>
                            <CFormTextarea
                              id="exampleFormControlTextarea1"
                              rows="3"
                              required
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value)
                              }}
                              minLength="50"
                            ></CFormTextarea>
                            <CFormFeedback invalid>Déscription est requise</CFormFeedback>
                            <p style={{ color: 'dimgray' }}> {description.length} caractères </p>
                          </CCol>
                        ) : (
                          <CCol md={6}>
                            <CFormLabel htmlFor="validationCustom01" style={{ fontWeight: 'bold' }}>
                              Spécifier l{"'"}etat:
                            </CFormLabel>

                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios1"
                              value="Non archivé"
                              label="Non archivé"
                              onChange={(e) => {
                                setEtat(e.target.value)
                              }}
                            />
                            <CFormCheck
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="Archivé"
                              label="Archivé"
                              onChange={(e) => {
                                setEtat(e.target.value)
                              }}
                              defaultChecked
                            />
                            <CFormLabel
                              style={{ fontWeight: 'bold' }}
                              htmlFor="exampleFormControlTextarea1"
                            >
                              Déscription (min 50 caractères)
                            </CFormLabel>
                            <CFormTextarea
                              id="exampleFormControlTextarea1"
                              rows="3"
                              required
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value)
                              }}
                              minLength="50"
                            ></CFormTextarea>
                            <CFormFeedback invalid>Déscription est requise</CFormFeedback>
                            <p style={{ color: 'dimgray' }}> {description.length} caractères </p>
                          </CCol>
                        )}

                        <CCol xs={12}>
                          <Button
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              'border-radius': '13px',
                              color: '#213f77',
                              borderColor: '#213f77',
                              width: '120px',
                              height: '40px',
                              'font-weight': 'bold',
                            }}
                            onClick={handleSubmitMdf}
                          >
                            Modifier
                          </Button>
                        </CCol>
                      </CForm>
                    </CCard>
                  </Modal.Body>
                </Modal>
                <button
                  className="btn-Supp custom-btn"
                  title="Supprimer"
                  onClick={() => supprimerFormation(item.id)}
                >
                  <i className="far fa-trash-alt fa-2x"></i>
                </button>

                {item.etat == 'Non archivé' ? (
                  <button className="btn-arch custom-btn" title="Non archivé">
                    <i
                      className="fa fa-eye fa-2x"
                      onClick={() => Archiverformation1(item.id, item)}
                    ></i>
                  </button>
                ) : (
                  <button className="btn-arch custom-btn" title="Archiver">
                    <i
                      className="fa fa-eye-slash fa-2x"
                      onClick={() => Archiverformation1(item.id, item)}
                    ></i>
                  </button>
                )}
              </div>
            </div>
          ))}

          <br></br>
          <CPagination
            className="justify-content-center"
            aria-label="Page navigation example"
            style={{ marginRight: 20 }}
          >
            <a
              onClick={() => {
                if (PreviewsPage != 0) {
                  setCurrentPage(PreviewsPage)
                  paginate(PreviewsPage)
                  setactiveNumber(PreviewsPage)
                }
              }}
            >
              <CPaginationItem aria-label="Previous" disabled>
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
            </a>
            <a>
              <CPaginationItem style={{ background: '#140788', color: 'white' }}>
                {activeNumber}
              </CPaginationItem>
            </a>
            <a
              onClick={() => {
                if (currentPage < posts.length / postsPerPage) {
                  setCurrentPage(NextPage)
                  paginate(NextPage)
                  setactiveNumber(NextPage)
                }
              }}
            >
              <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </a>
          </CPagination>

          <div className="row pagination_row" style={{ marginRight: 15, marginBottom: 15 }}>
            <div className="col">
              <div className="pagination_container d-flex flex-row align-items-center justify-content-start">
                <div className="courses_show_container ml-auto clearfix">
                  <div className="courses_show_text">
                    <span>1-{postsPerPage}</span> de <span>{posts.length}</span> resultats:
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CCard>
      </div>
    )
  }
}
export default ListeFormation
