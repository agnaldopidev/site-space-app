import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import { salvarPost, atualizarPost, deletarPost } from "../../servicos/firestore";
import estilos from "./estilos";
import { entradas } from "./entradas";
import { alteraDados } from "../../utils/comum";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import { salvarImagem } from '../../servicos/storage';

import putinha from '../../assets/ana.png';

// const putinha = 'https://img.freepik.com/fotos-gratis/retrato-de-mulher-jovem-e-bonita_23-2148930918.jpg?w=740&t=st=1678881076~exp=1678881676~hmac=a3fc70f790bf9182ed64494f161d26df1972985d89aba4238ed998bbf1248874';

export default function Post({ navigation, route }) {
    const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
    const { item } = route?.params || {};

    const [post, setPost] = useState({
        titulo: item?.titulo || "",
        fonte: item?.fonte || "",
        descricao: item?.descricao || "",
        imagemUrl: item?.imagemUrl || null
    });

    async function salvar() {
        setDesabilitarEnvio(true);

        if (item) {
            await atualizarPost(item.id, post);
            navigation.goBack();
        } else {
            const idPost = await salvarPost({ ...post, imagemUrl: '' });
            navigation.goBack();
            const url = await salvarImagem(putinha, 'putiane');
            await atualizarPost(idPost, {
                imagemUrl: url
            });
        }
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.containerTitulo}>
                <Text style={estilos.titulo}>{item ? "Editar post" : "Novo Post"}</Text>
                <IconeClicavel
                    exibir={!!item}
                    onPress={() => { deletarPost(item.id); navigation.goBack() }}
                    iconeNome="trash-2"
                />
            </View>
            <ScrollView style={{ width: "100%" }}>
                {entradas?.map((entrada) => (
                    <View key={entrada.id}>
                        <Text style={estilos.texto}>{entrada.label}</Text>
                        <TextInput
                            value={post[entrada.name]}
                            placeholder={entrada.label}
                            multiline={entrada.multiline}
                            onChangeText={(valor) =>
                                alteraDados(
                                    entrada.name,
                                    valor,
                                    post,
                                    setPost
                                )
                            }
                            style={
                                [estilos.entrada, entrada.multiline && estilos.entradaDescricao]
                            }
                        />
                    </View>
                ))}
                <TouchableOpacity style={estilos.imagem}>
                    <Image source={putinha} style={estilos.imagem} />
                </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={estilos.botao} onPress={salvar} disabled={desabilitarEnvio}>
                <Text style={estilos.textoBotao}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}